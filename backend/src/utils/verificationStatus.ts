import {
  VerificationStatus,
  VerificationContactStatus,
} from "../../generated/prisma/enums";

type ContactForDerivation = {
  status: VerificationContactStatus;
};

type ItemForDerivation = {
  status: VerificationStatus;
  mandatory: boolean;
};

export function deriveItemStatus(
  contacts: ContactForDerivation[],
  mandatory: boolean,
  minContacts: number,
): VerificationStatus {
  if (contacts.length === 0) {
    return VerificationStatus.PENDING;
  }

  const responded = contacts.filter(
    (c: ContactForDerivation) =>
      c.status === VerificationContactStatus.RESPONDED,
  );

  const expired = contacts.filter(
    (c: ContactForDerivation) => c.status === VerificationContactStatus.EXPIRED,
  );

  if (responded.length < minContacts) {
    return VerificationStatus.IN_PROGRESS;
  }

  if (mandatory && expired.length > 0) {
    VerificationStatus.FAILED;
  }

  return VerificationStatus.CLEAR;
}

export function applyDiscrepancy(
  currentStatus: VerificationStatus,
  hasMismatch: boolean,
): VerificationStatus {
  if (currentStatus === VerificationStatus.CLEAR && hasMismatch) {
    return VerificationStatus.DISCREPANCY;
  }

  return currentStatus;
}

export function deriveCaseStatus(
  items: ItemForDerivation[],
): VerificationStatus {
  if (items.length === 0) {
    return VerificationStatus.PENDING;
  }

  const mandatoryItems = items.filter((i: ItemForDerivation) => i.mandatory);
  const statuses = mandatoryItems.map((i: ItemForDerivation) => i.status);

  if (
    statuses.some(
      (s) =>
        s === VerificationStatus.PENDING ||
        s === VerificationStatus.IN_PROGRESS,
    )
  ) {
    return VerificationStatus.IN_PROGRESS;
  }

  if (statuses.includes(VerificationStatus.FAILED)) {
    return VerificationStatus.FAILED;
  }

  if (statuses.includes(VerificationStatus.DISCREPANCY)) {
    return VerificationStatus.DISCREPANCY;
  }

  return VerificationStatus.CLEAR;
}
