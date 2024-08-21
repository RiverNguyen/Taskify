import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { MAX_FREE_BOARD } from "@/constants/board";

export const incrementAvailableBoards = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Organization not found");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: {
        count: orgLimit.count + 1,
      },
    });
  } else {
    await db.orgLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

export const decreaseAvailableBoards = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Organization not found");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: {
        count: orgLimit.count > 0 ? orgLimit.count - 1 : 0,
      },
    });
  } else {
    await db.orgLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

export const hasAvailableBoards = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Organization not found");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (!orgLimit || orgLimit.count < MAX_FREE_BOARD) {
    return true;
  } else {
    return false;
  }
};

export const getAvailableBoards = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return 0;
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (!orgLimit) {
    return 0;
  }

  return orgLimit.count;
};
