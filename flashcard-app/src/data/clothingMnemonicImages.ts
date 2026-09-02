const clothingMnemonicImages: Record<string, string> = {
  'wortschatz-1-09-001': '/flashcards/clothing/das-hemd.webp',
  'wortschatz-1-09-002': '/flashcards/clothing/das-t-shirt.webp',
  'wortschatz-1-09-003': '/flashcards/clothing/der-pullover.webp',
  'wortschatz-1-09-004': '/flashcards/clothing/die-jacke.webp',
  'wortschatz-1-09-005': '/flashcards/clothing/der-mantel.webp',
  'wortschatz-1-09-006': '/flashcards/clothing/das-kleid.webp',
  'wortschatz-1-09-007': '/flashcards/clothing/die-hose.webp',
  'wortschatz-1-09-008': '/flashcards/clothing/der-rock.webp',
  'wortschatz-1-09-009': '/flashcards/clothing/der-schuh.webp',
  'wortschatz-1-09-010': '/flashcards/clothing/die-socke.webp',
  'wortschatz-1-09-011': '/flashcards/clothing/der-guertel.webp',
  'wortschatz-1-09-012': '/flashcards/clothing/die-muetze.webp',
  'wortschatz-1-09-013': '/flashcards/clothing/der-hut.webp',
  'wortschatz-1-09-014': '/flashcards/clothing/der-schal.webp',
  'wortschatz-1-09-015': '/flashcards/clothing/der-handschuh.webp',
  'wortschatz-1-09-016': '/flashcards/clothing/die-brille.webp',
  'wortschatz-1-09-017': '/flashcards/clothing/die-tasche.webp',
};

export const getClothingMnemonicImage = (cardId?: string): string | undefined =>
  cardId ? clothingMnemonicImages[cardId] : undefined;
