import { MessageEmbed } from "discord.js";
import {
  chain,
  compact,
  filter,
  forEach,
  map,
  partition,
  round,
  uniq,
} from "lodash";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";
import { ServiceCallback, DiscordChannel } from "../helpers/type";

import { helpDoc } from "../config";
import {
  BossItem,
  deleteBossItem,
  getBossItem,
  putBossItem,
  scanAllBossItems,
  updateBossItem,
} from "../dynamodb/boss";
import escapeDiscord from "../helpers/escape";

const ROUND_PRECISION = 1;
const MAX_PRICE = 1000000000000;

const getDividend = (bossItem: BossItem): number => {
  const peopleCnt = bossItem.to.length + 1;
  const { price = 0, commission = 1 } = bossItem;
  return round((price * commission) / peopleCnt, ROUND_PRECISION);
};

/* command list */
export const helpBoss = async (channel: DiscordChannel) => {
  await channel.send({
    embeds: [
      new MessageEmbed({
        title: "tron boss 커맨드",
        description: [
          "tron boss add",
          "tron boss remove",
          "tron boss delete",
          "tron boss price",
          "tron boss pay",
          "tron boss receipt",
          "tron boss list",
          "tron boss info",
          "tron boss rename",
          `자세한 사항은 [Command DOCS](${helpDoc})`,
        ].join("\n"),
      }),
    ],
  });
};

export const addBoss = async (
  channel: DiscordChannel,
  guild: string,
  itemName: string,
  fromUser: string,
  toUsers: string[],
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);

  const itemId = customAlphabet(nolookalikes, 6)();
  await putBossItem(guild, itemId, itemName, fromUser, toUsers);
  await done(escapeDiscord(`[${itemId}]: ${itemName} 등록 완료!`));
};

export const removeBoss = async (
  channel: DiscordChannel,
  guild: string,
  itemId: string,
  userId: string,
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);

  const bossItem = await getBossItem(guild, itemId);
  if (!bossItem) {
    await done("해당하는 아이템이 없습니다.");
    return;
  }
  if (bossItem.from !== userId) {
    await done(`[${itemId}]: 권한이 없습니다.`);
    return;
  }

  const success = await deleteBossItem(guild, itemId);
  if (success) await done(`[${itemId}]: 삭제 완료`);
  else await done(`[${itemId}]: 삭제 실패`);
};

export const updateBossPrice = async (
  channel: DiscordChannel,
  guild: string,
  itemId: string,
  price: number,
  commission?: number,
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);
  if (price < 0 || price > MAX_PRICE) {
    await done("잘못된 가격입니다.");
    return;
  }

  const bossItem = await updateBossItem(
    guild,
    itemId,
    {
      price,
      commission,
    },
    {}
  );

  if (bossItem)
    await done(
      escapeDiscord(
        `[${itemId}]: ${bossItem.itemName} 가격 등록 완료! (인당 ${getDividend(
          bossItem
        )})`
      )
    );
  else await done(escapeDiscord(`[${itemId}]:  가격 등록 실패!`));
};

export const payBossUser = async (
  channel: DiscordChannel,
  guild: string,
  fromUser: string,
  toUser: string,
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);

  const allBossItems = await scanAllBossItems(guild);
  const validBossItems = allBossItems.filter(
    (bossItem) =>
      !!bossItem.price &&
      bossItem.from === fromUser &&
      bossItem.to.includes(toUser) &&
      !bossItem.pay.includes(toUser)
  );
  const paidItemsWithEmpty = await Promise.all(
    validBossItems.map((item) => {
      return updateBossItem(guild, item.itemId, {}, { pay: [toUser] });
    })
  );
  const paidItems = compact(paidItemsWithEmpty);

  const amount = chain(paidItems)
    .map((item) => getDividend(item))
    .sum()
    .round(ROUND_PRECISION)
    .value();
  if (amount) {
    await done(`<@!${toUser}>에게 ${amount} 상환 완료!`);
    await Promise.all(
      map(paidItems, async (item) => {
        if (item.to.length === item.pay.length) {
          await deleteBossItem(guild, item.itemId);
          await channel.send(
            escapeDiscord(
              `[${item.itemId}] ${item.itemName} 상환이 완료되어 삭제합니다.`
            )
          );
        }
      })
    );
  } else {
    await done(`<@!${toUser}>에게 상환 할 내역이 없습니다.`);
  }
};

export const payBossItem = async (
  channel: DiscordChannel,
  guild: string,
  itemId: string,
  fromUser: string,
  toUsers: string[],
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);

  const prevItem = await getBossItem(guild, itemId);
  if (!prevItem) {
    await done("아이템이 없습니다.");
    return;
  }

  if (prevItem.from !== fromUser) {
    await done(`[${itemId}]: 권한이 없습니다.`);
    return;
  }
  const existUserIds = uniq(toUsers).filter(
    (userId) => prevItem.to.includes(userId) && !prevItem.pay.includes(userId)
  );

  const bossItem = await updateBossItem(
    guild,
    itemId,
    {},
    { pay: existUserIds }
  );

  if (bossItem) {
    await done(
      escapeDiscord(
        `[${itemId}]: ${bossItem.itemName} ${existUserIds.length}명 상환 완료!`
      )
    );

    if (bossItem.to.length === bossItem.pay.length) {
      await deleteBossItem(guild, bossItem.itemId);
      await channel.send(
        escapeDiscord(
          `[${itemId}]: ${bossItem.itemName} 상환이 완료되어 삭제합니다.`
        )
      );
    }
  } else {
    await done(`[${itemId}]: 상환 실패`);
  }
};

export const receiptBoss = async (
  channel: DiscordChannel,
  guild: string,
  userId: string,
  displayName?: string
) => {
  const bossItems = await scanAllBossItems(guild);
  const myBossItems = filter(
    bossItems,
    (item) =>
      item.from === userId ||
      (item.to.includes(userId) && !item.pay.includes(userId))
  );

  const [itemsToGive, itemsToGet] = partition(
    filter(myBossItems, (item) => !!item.price),
    (item) => item.from === userId
  );

  const sumToGive: { [userId: string]: number } = {};
  const sumToGet: { [userId: string]: number } = {};

  forEach(itemsToGive, (item) => {
    forEach(item.to, (toUser) => {
      if (item.pay.includes(toUser)) return;
      const prevPrice = sumToGive[toUser];
      const dividend = getDividend(item);
      sumToGive[toUser] = round(dividend + (prevPrice ?? 0), ROUND_PRECISION);
    });
  });

  forEach(itemsToGet, (item) => {
    if (item.pay.includes(userId)) return;
    const fromUser = item.from;
    const prevPrice = sumToGet[fromUser];
    const dividend = getDividend(item);
    sumToGet[fromUser] = round(dividend + (prevPrice ?? 0), ROUND_PRECISION);
  });

  const netSum: { netUserId: string; net: number }[] = chain([
    ...Object.keys(sumToGive),
    ...Object.keys(sumToGet),
  ])
    .uniq()
    .map((netUserId) => {
      const give = sumToGive[netUserId] ?? 0;
      const get = sumToGet[netUserId] ?? 0;
      return { netUserId, net: round(give - get, ROUND_PRECISION) };
    })
    .value();

  const notExist = "존재 하지 않습니다.";

  const giveDescription =
    map(sumToGive, (amount, user) => {
      return `<@!${user}> ${amount}`;
    }).join("\n") || notExist;
  const getDescription =
    map(sumToGet, (amount, user) => {
      return `<@!${user}> ${amount}`;
    }).join("\n") || notExist;
  const netDescription =
    map(netSum, ({ netUserId, net }) => {
      return `<@!${netUserId}> ${net}`;
    }).join("\n") || notExist;

  const messageEmbed = new MessageEmbed()
    .setTitle(`${[displayName, "영수증"].join(" ")}`)
    .addFields([
      { name: "받을 돈", value: escapeDiscord(getDescription) },
      { name: "줄 돈", value: escapeDiscord(giveDescription) },
      { name: "차액 (줄 돈)", value: escapeDiscord(netDescription) },
    ]);

  await channel.send({
    embeds: [messageEmbed],
  });
};

export const listBoss = async (
  channel: DiscordChannel,
  guild: string,
  userId?: string,
  displayName?: string
) => {
  const bossItems = await scanAllBossItems(guild);

  if (!userId) {
    const [itemsWithPrice, itemsWithoutPrice] = partition(bossItems, "price");
    const descriptionWithPrice = itemsWithPrice
      .map(
        (item) =>
          `${item.itemId}(${getDividend(item)}): ${item.itemName} <@!${
            item.from
          }>`
      )
      .join("\n");
    const descriptionWithoutPrice = itemsWithoutPrice
      .map((item) => `${item.itemId}: ${item.itemName} <@!${item.from}>`)
      .join("\n");

    const messageEmbed = new MessageEmbed().setTitle("모든 아이템").addFields([
      { name: "팔린 아이템", value: escapeDiscord(descriptionWithPrice) },
      {
        name: "팔리지 않은 아이템",
        value: escapeDiscord(descriptionWithoutPrice),
      },
    ]);

    await channel.send({
      embeds: [messageEmbed],
    });
    return;
  }

  const myBossItems = filter(
    bossItems,
    (item) =>
      item.from === userId ||
      (item.to.includes(userId) && !item.pay.includes(userId))
  );

  const description = myBossItems
    .map((item) => {
      return `${item.itemId}${item.price ? ` (${getDividend(item)})` : ""} : ${
        item.itemName
      } <@!${item.from}>`;
    })
    .join("\n");
  await channel.send({
    embeds: [
      new MessageEmbed({
        title: `${[displayName, "잔여 아이템"].join(" ")}`,
        description: escapeDiscord(description),
      }),
    ],
  });
};
export const infoBoss = async (
  channel: DiscordChannel,
  guild: string,
  itemId: string
) => {
  const bossItem = await getBossItem(guild, itemId);
  if (!bossItem) {
    await channel.send("해당하는 아이템이 없습니다.");
    return;
  }

  const description = [
    `From: <@!${bossItem.from}>`,
    `To: ${bossItem.to
      .map((userId) => {
        return `<@!${userId}>`;
      })
      .join(" ")}`,
    `Paid: ${
      bossItem.pay.length
        ? bossItem.pay
            .map((userId) => {
              return `<@!${userId}>`;
            })
            .join(" ")
        : "X"
    }`,
    `Price: ${bossItem.price ?? "X"}`,
    `Price per people: ${getDividend(bossItem) || "X"}`,
  ].join("\n");

  await channel.send({
    embeds: [
      new MessageEmbed({
        title: `${bossItem.itemName} (${bossItem.itemId})`,
        description: escapeDiscord(description),
      }),
    ],
  });
};

export const renameBoss = async (
  channel: DiscordChannel,
  guild: string,
  itemId: string,
  itemName: string,
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);
  const bossItem = await updateBossItem(guild, itemId, { itemName }, {});

  if (bossItem) {
    await done(
      escapeDiscord(`[${bossItem.itemId}]: ${bossItem.itemName} 개명 완료`)
    );
  } else {
    await done(`[${itemId}]:  개명 실패`);
  }
};
