// Bible verses organized by category
export type BibleVerse = {
  reference: string;
  text: string;
  category: string;
};

export const bibleVerses: BibleVerse[] = [
  // ==================== FAITH ====================
  { reference: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen.", category: "faith" },
  { reference: "Romans 10:17", text: "So then faith cometh by hearing, and hearing by the word of God.", category: "faith" },
  { reference: "Matthew 17:20", text: "If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove.", category: "faith" },
  { reference: "Mark 11:24", text: "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.", category: "faith" },
  { reference: "James 2:17", text: "Even so faith, if it hath not works, is dead, being alone.", category: "faith" },
  { reference: "2 Corinthians 5:7", text: "For we walk by faith, not by sight.", category: "faith" },
  { reference: "Galatians 2:20", text: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me.", category: "faith" },
  { reference: "Ephesians 2:8", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.", category: "faith" },
  { reference: "Hebrews 11:6", text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.", category: "faith" },
  { reference: "Romans 1:17", text: "For therein is the righteousness of God revealed from faith to faith: as it is written, The just shall live by faith.", category: "faith" },
  { reference: "1 Peter 1:7", text: "That the trial of your faith, being much more precious than of gold that perisheth, though it be tried with fire, might be found unto praise and honour and glory.", category: "faith" },
  { reference: "Matthew 21:22", text: "And all things, whatsoever ye shall ask in prayer, believing, ye shall receive.", category: "faith" },
  { reference: "Mark 9:23", text: "Jesus said unto him, If thou canst believe, all things are possible to him that believeth.", category: "faith" },
  { reference: "Romans 4:20-21", text: "He staggered not at the promise of God through unbelief; but was strong in faith, giving glory to God.", category: "faith" },
  { reference: "Hebrews 10:38", text: "Now the just shall live by faith: but if any man draw back, my soul shall have no pleasure in him.", category: "faith" },
  { reference: "1 John 5:4", text: "For whatsoever is born of God overcometh the world: and this is the victory that overcometh the world, even our faith.", category: "faith" },
  { reference: "Matthew 9:29", text: "Then touched he their eyes, saying, According to your faith be it unto you.", category: "faith" },
  { reference: "Luke 17:6", text: "And the Lord said, If ye had faith as a grain of mustard seed, ye might say unto this sycamine tree, Be thou plucked up by the root.", category: "faith" },
  { reference: "Habakkuk 2:4", text: "Behold, his soul which is lifted up is not upright in him: but the just shall live by his faith.", category: "faith" },
  { reference: "James 1:6", text: "But let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea driven with the wind and tossed.", category: "faith" },

  // ==================== LOVE ====================
  { reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", category: "love" },
  { reference: "1 Corinthians 13:4", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.", category: "love" },
  { reference: "1 Corinthians 13:13", text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.", category: "love" },
  { reference: "1 John 4:8", text: "He that loveth not knoweth not God; for God is love.", category: "love" },
  { reference: "Romans 8:38-39", text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, shall be able to separate us from the love of God.", category: "love" },
  { reference: "John 15:13", text: "Greater love hath no man than this, that a man lay down his life for his friends.", category: "love" },
  { reference: "1 John 4:19", text: "We love him, because he first loved us.", category: "love" },
  { reference: "Matthew 22:37-39", text: "Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment.", category: "love" },
  { reference: "1 Corinthians 13:2", text: "And though I have the gift of prophecy, and understand all mysteries, and all knowledge; and though I have all faith, so that I could remove mountains, and have not charity, I am nothing.", category: "love" },
  { reference: "1 John 4:7", text: "Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God.", category: "love" },
  { reference: "John 13:34", text: "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.", category: "love" },
  { reference: "Romans 13:10", text: "Love worketh no ill to his neighbour: therefore love is the fulfilling of the law.", category: "love" },
  { reference: "1 Peter 4:8", text: "And above all things have fervent charity among yourselves: for charity shall cover the multitude of sins.", category: "love" },
  { reference: "1 John 3:18", text: "My little children, let us not love in word, neither in tongue; but in deed and in truth.", category: "love" },
  { reference: "Galatians 5:22", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith.", category: "love" },
  { reference: "Ephesians 5:2", text: "And walk in love, as Christ also hath loved us, and hath given himself for us an offering and a sacrifice to God.", category: "love" },
  { reference: "Colossians 3:14", text: "And above all these things put on charity, which is the bond of perfectness.", category: "love" },
  { reference: "1 John 4:11", text: "Beloved, if God so loved us, we ought also to love one another.", category: "love" },
  { reference: "Romans 5:8", text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", category: "love" },
  { reference: "Song of Solomon 8:7", text: "Many waters cannot quench love, neither can the floods drown it.", category: "love" },

  // ==================== WISDOM ====================
  { reference: "Proverbs 1:7", text: "The fear of the LORD is the beginning of knowledge: but fools despise wisdom and instruction.", category: "wisdom" },
  { reference: "James 1:5", text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", category: "wisdom" },
  { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.", category: "wisdom" },
  { reference: "Proverbs 4:7", text: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.", category: "wisdom" },
  { reference: "Ecclesiastes 7:12", text: "For wisdom is a defence, and money is a defence: but the excellency of knowledge is, that wisdom giveth life to them that have it.", category: "wisdom" },
  { reference: "Proverbs 9:10", text: "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.", category: "wisdom" },
  { reference: "Colossians 3:16", text: "Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another.", category: "wisdom" },
  { reference: "Proverbs 16:16", text: "How much better is it to get wisdom than gold! and to get understanding rather to be chosen than silver!", category: "wisdom" },
  { reference: "Proverbs 2:6", text: "For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding.", category: "wisdom" },
  { reference: "Proverbs 3:13", text: "Happy is the man that findeth wisdom, and the man that getteth understanding.", category: "wisdom" },
  { reference: "Proverbs 4:5", text: "Get wisdom, get understanding: forget it not; neither decline from the words of my mouth.", category: "wisdom" },
  { reference: "Proverbs 11:2", text: "When pride cometh, then cometh shame: but with the lowly is wisdom.", category: "wisdom" },
  { reference: "Proverbs 13:10", text: "Only by pride cometh contention: but with the well advised is wisdom.", category: "wisdom" },
  { reference: "Proverbs 19:8", text: "He that getteth wisdom loveth his own soul: he that keepeth understanding shall find good.", category: "wisdom" },
  { reference: "Ecclesiastes 2:26", text: "For God giveth to a man that is good in his sight wisdom, and knowledge, and joy.", category: "wisdom" },
  { reference: "James 3:17", text: "But the wisdom that is from above is first pure, then peaceable, gentle, and easy to be intreated, full of mercy and good fruits.", category: "wisdom" },
  { reference: "Proverbs 24:14", text: "So shall the knowledge of wisdom be unto thy soul: when thou hast found it, then there shall be a reward.", category: "wisdom" },
  { reference: "Daniel 2:21", text: "And he changeth the times and the seasons: he removeth kings, and setteth up kings: he giveth wisdom unto the wise.", category: "wisdom" },
  { reference: "Proverbs 8:11", text: "For wisdom is better than rubies; and all the things that may be desired are not to be compared to it.", category: "wisdom" },
  { reference: "1 Corinthians 1:25", text: "Because the foolishness of God is wiser than men; and the weakness of God is stronger than men.", category: "wisdom" },

  // ==================== HEALING ====================
  { reference: "Jeremiah 17:14", text: "Heal me, O LORD, and I shall be healed; save me, and I shall be saved: for thou art my praise.", category: "healing" },
  { reference: "Isaiah 53:5", text: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.", category: "healing" },
  { reference: "Psalm 103:2-3", text: "Bless the LORD, O my soul, and forget not all his benefits: Who forgiveth all thine iniquities; who healeth all thy diseases.", category: "healing" },
  { reference: "James 5:15", text: "And the prayer of faith shall save the sick, and the Lord shall raise him up.", category: "healing" },
  { reference: "3 John 1:2", text: "Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth.", category: "healing" },
  { reference: "Exodus 15:26", text: "I am the LORD that healeth thee.", category: "healing" },
  { reference: "Psalm 147:3", text: "He healeth the broken in heart, and bindeth up their wounds.", category: "healing" },
  { reference: "Matthew 9:35", text: "And Jesus went about all the cities and villages, teaching in their synagogues, and preaching the gospel of the kingdom, and healing every sickness and every disease among the people.", category: "healing" },
  { reference: "Psalm 30:2", text: "O LORD my God, I cried unto thee, and thou hast healed me.", category: "healing" },
  { reference: "Psalm 41:3", text: "The LORD will strengthen him upon the bed of languishing: thou wilt make all his bed in his sickness.", category: "healing" },
  { reference: "Proverbs 4:22", text: "For they are life unto those that find them, and health to all their flesh.", category: "healing" },
  { reference: "Isaiah 58:8", text: "Then shall thy light break forth as the morning, and thine health shall spring forth speedily.", category: "healing" },
  { reference: "Jeremiah 30:17", text: "For I will restore health unto thee, and I will heal thee of thy wounds, saith the LORD.", category: "healing" },
  { reference: "Malachi 4:2", text: "But unto you that fear my name shall the Sun of righteousness arise with healing in his wings.", category: "healing" },
  { reference: "Matthew 4:23", text: "And Jesus went about all Galilee, teaching in their synagogues, and preaching the gospel of the kingdom, and healing all manner of sickness.", category: "healing" },
  { reference: "Matthew 8:17", text: "That it might be fulfilled which was spoken by Esaias the prophet, saying, Himself took our infirmities, and bare our sicknesses.", category: "healing" },
  { reference: "Mark 5:34", text: "And he said unto her, Daughter, thy faith hath made thee whole; go in peace, and be whole of thy plague.", category: "healing" },
  { reference: "Luke 6:19", text: "And the whole multitude sought to touch him: for there went virtue out of him, and healed them all.", category: "healing" },
  { reference: "Acts 10:38", text: "How God anointed Jesus of Nazareth with the Holy Ghost and with power: who went about doing good, and healing all that were oppressed of the devil.", category: "healing" },
  { reference: "1 Peter 2:24", text: "Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness: by whose stripes ye were healed.", category: "healing" },

  // ==================== MARRIAGE ====================
  { reference: "Genesis 2:24", text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.", category: "marriage" },
  { reference: "Ephesians 5:25", text: "Husbands, love your wives, even as Christ also loved the church, and gave himself for it.", category: "marriage" },
  { reference: "Proverbs 18:22", text: "Whoso findeth a wife findeth a good thing, and obtaineth favour of the LORD.", category: "marriage" },
  { reference: "Mark 10:9", text: "What therefore God hath joined together, let not man put asunder.", category: "marriage" },
  { reference: "1 Corinthians 13:7", text: "Beareth all things, believeth all things, hopeth all things, endureth all things.", category: "marriage" },
  { reference: "Ecclesiastes 4:9-10", text: "Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow.", category: "marriage" },
  { reference: "Colossians 3:19", text: "Husbands, love your wives, and be not bitter against them.", category: "marriage" },
  { reference: "1 Peter 3:7", text: "Likewise, ye husbands, dwell with them according to knowledge, giving honour unto the wife, as unto the weaker vessel.", category: "marriage" },
  { reference: "Ephesians 5:31", text: "For this cause shall a man leave his father and mother, and shall be joined unto his wife, and they two shall be one flesh.", category: "marriage" },
  { reference: "Proverbs 31:10", text: "Who can find a virtuous woman? for her price is far above rubies.", category: "marriage" },
  { reference: "Hebrews 13:4", text: "Marriage is honourable in all, and the bed undefiled: but whoremongers and adulterers God will judge.", category: "marriage" },
  { reference: "Ephesians 5:28", text: "So ought men to love their wives as their own bodies. He that loveth his wife loveth himself.", category: "marriage" },
  { reference: "1 Corinthians 7:3", text: "Let the husband render unto the wife due benevolence: and likewise also the wife unto the husband.", category: "marriage" },
  { reference: "Proverbs 12:4", text: "A virtuous woman is a crown to her husband: but she that maketh ashamed is as rottenness in his bones.", category: "marriage" },
  { reference: "Proverbs 31:11", text: "The heart of her husband doth safely trust in her, so that he shall have no need of spoil.", category: "marriage" },
  { reference: "Ephesians 5:33", text: "Nevertheless let every one of you in particular so love his wife even as himself; and the wife see that she reverence her husband.", category: "marriage" },
  { reference: "1 Corinthians 7:2", text: "Nevertheless, to avoid fornication, let every man have his own wife, and let every woman have her own husband.", category: "marriage" },
  { reference: "Matthew 19:6", text: "Wherefore they are no more twain, but one flesh. What therefore God hath joined together, let not man put asunder.", category: "marriage" },
  { reference: "Proverbs 19:14", text: "House and riches are the inheritance of fathers: and a prudent wife is from the LORD.", category: "marriage" },
  { reference: "Song of Solomon 4:9", text: "Thou hast ravished my heart, my sister, my spouse; thou hast ravished my heart with one of thine eyes.", category: "marriage" },

  // ==================== GRACE ====================
  { reference: "Ephesians 2:8-9", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.", category: "grace" },
  { reference: "2 Corinthians 12:9", text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.", category: "grace" },
  { reference: "Romans 5:8", text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", category: "grace" },
  { reference: "Titus 2:11", text: "For the grace of God that bringeth salvation hath appeared to all men.", category: "grace" },
  { reference: "John 1:16", text: "And of his fulness have all we received, and grace for grace.", category: "grace" },
  { reference: "Romans 6:14", text: "For sin shall not have dominion over you: for ye are not under the law, but under grace.", category: "grace" },
  { reference: "Hebrews 4:16", text: "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.", category: "grace" },
  { reference: "2 Peter 3:18", text: "But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ.", category: "grace" },
  { reference: "Romans 3:24", text: "Being justified freely by his grace through the redemption that is in Christ Jesus.", category: "grace" },
  { reference: "Romans 5:17", text: "For if by one man's offence death reigned by one; much more they which receive abundance of grace and of the gift of righteousness shall reign in life by one, Jesus Christ.", category: "grace" },
  { reference: "Romans 5:20", text: "Moreover the law entered, that the offence might abound. But where sin abounded, grace did much more abound.", category: "grace" },
  { reference: "Romans 11:6", text: "And if by grace, then is it no more of works: otherwise grace is no more grace.", category: "grace" },
  { reference: "2 Corinthians 8:9", text: "For ye know the grace of our Lord Jesus Christ, that, though he was rich, yet for your sakes he became poor.", category: "grace" },
  { reference: "Galatians 2:21", text: "I do not frustrate the grace of God: for if righteousness come by the law, then Christ is dead in vain.", category: "grace" },
  { reference: "Ephesians 1:7", text: "In whom we have redemption through his blood, the forgiveness of sins, according to the riches of his grace.", category: "grace" },
  { reference: "Ephesians 2:5", text: "Even when we were dead in sins, hath quickened us together with Christ, (by grace ye are saved).", category: "grace" },
  { reference: "Colossians 4:6", text: "Let your speech be alway with grace, seasoned with salt, that ye may know how ye ought to answer every man.", category: "grace" },
  { reference: "2 Timothy 1:9", text: "Who hath saved us, and called us with an holy calling, not according to our works, but according to his own purpose and grace.", category: "grace" },
  { reference: "Titus 3:7", text: "That being justified by his grace, we should be made heirs according to the hope of eternal life.", category: "grace" },
  { reference: "1 Peter 5:10", text: "But the God of all grace, who hath called us unto his eternal glory by Christ Jesus, after that ye have suffered a while, make you perfect.", category: "grace" },

  // ==================== PROSPERITY ====================
  { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", category: "prosperity" },
  { reference: "Philippians 4:19", text: "But my God shall supply all your need according to his riches in glory by Christ Jesus.", category: "prosperity" },
  { reference: "Deuteronomy 8:18", text: "But thou shalt remember the LORD thy God: for it is he that giveth thee power to get wealth.", category: "prosperity" },
  { reference: "Malachi 3:10", text: "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts.", category: "prosperity" },
  { reference: "Joshua 1:8", text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein.", category: "prosperity" },
  { reference: "Psalm 1:3", text: "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither.", category: "prosperity" },
  { reference: "Proverbs 10:22", text: "The blessing of the LORD, it maketh rich, and he addeth no sorrow with it.", category: "prosperity" },
  { reference: "Luke 6:38", text: "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over.", category: "prosperity" },
  { reference: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want.", category: "prosperity" },
  { reference: "Psalm 34:10", text: "The young lions do lack, and suffer hunger: but they that seek the LORD shall not want any good thing.", category: "prosperity" },
  { reference: "Psalm 35:27", text: "Let them shout for joy, and be glad, that favour my righteous cause: yea, let them say continually, Let the LORD be magnified, which hath pleasure in the prosperity of his servant.", category: "prosperity" },
  { reference: "Psalm 37:4", text: "Delight thyself also in the LORD; and he shall give thee the desires of thine heart.", category: "prosperity" },
  { reference: "Psalm 84:11", text: "For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly.", category: "prosperity" },
  { reference: "Psalm 112:3", text: "Wealth and riches shall be in his house: and his righteousness endureth for ever.", category: "prosperity" },
  { reference: "Proverbs 3:9-10", text: "Honour the LORD with thy substance, and with the firstfruits of all thine increase: So shall thy barns be filled with plenty.", category: "prosperity" },
  { reference: "Proverbs 8:21", text: "That I may cause those that love me to inherit substance; and I will fill their treasures.", category: "prosperity" },
  { reference: "Proverbs 13:22", text: "A good man leaveth an inheritance to his children's children: and the wealth of the sinner is laid up for the just.", category: "prosperity" },
  { reference: "Proverbs 22:4", text: "By humility and the fear of the LORD are riches, and honour, and life.", category: "prosperity" },
  { reference: "2 Corinthians 9:8", text: "And God is able to make all grace abound toward you; that ye, always having all sufficiency in all things, may abound to every good work.", category: "prosperity" },
  { reference: "3 John 1:2", text: "Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth.", category: "prosperity" },

  // ==================== SALVATION ====================
  { reference: "Romans 10:9", text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.", category: "salvation" },
  { reference: "John 14:6", text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", category: "salvation" },
  { reference: "Acts 4:12", text: "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved.", category: "salvation" },
  { reference: "Romans 6:23", text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.", category: "salvation" },
  { reference: "John 5:24", text: "Verily, verily, I say unto you, He that heareth my word, and believeth on him that sent me, hath everlasting life.", category: "salvation" },
  { reference: "Acts 16:31", text: "Believe on the Lord Jesus Christ, and thou shalt be saved, and thy house.", category: "salvation" },
  { reference: "Titus 3:5", text: "Not by works of righteousness which we have done, but according to his mercy he saved us.", category: "salvation" },
  { reference: "1 John 5:13", text: "These things have I written unto you that believe on the name of the Son of God; that ye may know that ye have eternal life.", category: "salvation" },
  { reference: "John 1:12", text: "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name.", category: "salvation" },
  { reference: "John 3:3", text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.", category: "salvation" },
  { reference: "John 3:36", text: "He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life.", category: "salvation" },
  { reference: "John 10:9", text: "I am the door: by me if any man enter in, he shall be saved, and shall go in and out, and find pasture.", category: "salvation" },
  { reference: "John 11:25", text: "Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.", category: "salvation" },
  { reference: "Acts 2:21", text: "And it shall come to pass, that whosoever shall call on the name of the Lord shall be saved.", category: "salvation" },
  { reference: "Romans 1:16", text: "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth.", category: "salvation" },
  { reference: "Romans 5:9", text: "Much more then, being now justified by his blood, we shall be saved from wrath through him.", category: "salvation" },
  { reference: "Romans 10:13", text: "For whosoever shall call upon the name of the Lord shall be saved.", category: "salvation" },
  { reference: "2 Corinthians 5:17", text: "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.", category: "salvation" },
  { reference: "1 Timothy 2:5", text: "For there is one God, and one mediator between God and men, the man Christ Jesus.", category: "salvation" },
  { reference: "1 Peter 1:9", text: "Receiving the end of your faith, even the salvation of your souls.", category: "salvation" },
];

// Get verses by category
export function getVersesByCategory(category: string): BibleVerse[] {
  if (category === 'random') {
    return bibleVerses;
  }
  return bibleVerses.filter(v => v.category === category);
}

// Get random verses from a category
export function getRandomVerses(category: string, count: number): BibleVerse[] {
  const categoryVerses = getVersesByCategory(category);
  const shuffled = [...categoryVerses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Generate wrong answers for a verse (other references from same category)
export function generateWrongAnswers(correctVerse: BibleVerse, count: number = 3): string[] {
  const allVerses = bibleVerses.filter(v => v.reference !== correctVerse.reference);
  const shuffled = [...allVerses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(v => v.reference);
}

// Get count of verses per category
export function getVerseCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const verse of bibleVerses) {
    counts[verse.category] = (counts[verse.category] || 0) + 1;
  }
  return counts;
}
