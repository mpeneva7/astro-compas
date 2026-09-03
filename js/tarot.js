/* ═════════════════════════════════════════════════════════════ */
/* ТАРО КАРТОМАНТИЯ — КОНФИГУРАЦИЯ                              */
/* ═════════════════════════════════════════════════════════════ */

const IMAGE_BASE = 'assets/tarot-images/';
const IMAGE_EXT = '.jpeg';

const DECK = [
  { id: 'major-00', nameEn: 'The Fool', nameBg: 'Шутът', filename: '0 - The Fool_enhanced Medium.jpeg', uprightBg: 'Безразсъдство и увлечение — тръгване напред без оглед на последствията.', reversedBg: 'Небрежност, отсъствие и апатия; разпиляване без посока.' },
  { id: 'major-01', nameEn: 'The Magician', nameBg: 'Магьосникът', filename: '1 - The Magician_enhanced Medium.jpeg', uprightBg: 'Умение, воля и находчивост — човек, който владее средствата си.', reversedBg: 'Дарбата, употребена зле: безпокойство, безчестие и смут в ума.' },
  { id: 'major-02', nameEn: 'The High Priestess', nameBg: 'Върховната жрица', filename: '2 - The High Priestess_enhanced Medium.jpeg', uprightBg: 'Тайна, мълчание и знание, което още не е разкрито.', reversedBg: 'Страст и повърхностно знание, взето за мъдрост.' },
  { id: 'major-03', nameEn: 'The Empress', nameBg: 'Императрицата', filename: '3 - The Empress_enhanced Medium.jpeg', uprightBg: 'Плодородие, действие и начало, което ражда нещо трайно.', reversedBg: 'Изясняване на заплетени неща — или колебание, което не позволява нищо да се роди.' },
  { id: 'major-04', nameEn: 'The Emperor', nameBg: 'Императорът', filename: '4 - The Emperor_enhanced Medium.jpeg', uprightBg: 'Устойчивост, власт и закрила; разум, който налага ред.', reversedBg: 'Незрялост и препятствие — власт без основа под себе си.' },
  { id: 'major-05', nameEn: 'The Hierophant', nameBg: 'Йерофантът', filename: '5 - The Hierophant_enhanced Medium.jpeg', uprightBg: 'Съюз, наставление и милост; човекът, към когото се обръщаш за съвет.', reversedBg: 'Прекомерна отстъпчивост и съгласие, купено с отслабване.' },
  { id: 'major-06', nameEn: 'The Lovers', nameBg: 'Влюбените', filename: '6 - The Lovers_enhanced Medium.jpeg', uprightBg: 'Привличане, любов и красота; изпитания, които са преодолени.', reversedBg: 'Провал и неразумни намерения; осуетен съюз.' },
  { id: 'major-07', nameEn: 'The Chariot', nameBg: 'Колесницата', filename: '7 - The Chariot_enhanced Medium.jpeg', uprightBg: 'Триумф и подкрепа — победа, извоювана със сила на волята.', reversedBg: 'Раздор, спор и поражение след прибързан устрем.' },
  { id: 'major-08', nameEn: 'Strength', nameBg: 'Силата', filename: '8 - Strength_enhanced Medium.jpeg', uprightBg: 'Сила, смелост и великодушие; успех, постигнат с достойнство.', reversedBg: 'Злоупотреба с власт или слабост, която ражда разногласие.' },
  { id: 'major-09', nameEn: 'The Hermit', nameBg: 'Отшелникът', filename: '9 - The Hermit_enhanced Medium.jpeg', uprightBg: 'Благоразумие и предпазливост — оттегляне, за да видиш ясно.', reversedBg: 'Прикритост и страх; предпазливост, която вече няма основание.' },
  { id: 'major-10', nameEn: 'Wheel of Fortune', nameBg: 'Колелото на съдбата', filename: '10 - Wheel of Fortune_enhanced Medium.jpeg', uprightBg: 'Съдба и успех — колелото се завърта в твоя полза.', reversedBg: 'Изобилие, което прелива и се превръща в излишък.' },
  { id: 'major-11', nameEn: 'Justice', nameBg: 'Правосъдие', filename: '11 - Justice_enhanced Medium.jpeg', uprightBg: 'Справедливост, честност и победа на заслужаващата страна.', reversedBg: 'Правни усложнения, предубеденост и прекомерна строгост.' },
  { id: 'major-12', nameEn: 'The Hanged Man', nameBg: 'Обесеният', filename: '12 - The Hanged Man_enhanced Medium.jpeg', uprightBg: 'Мъдрост, различаване и доброволна жертва в името на прозрение.', reversedBg: 'Себичност и подчинение на мнението на тълпата.' },
  { id: 'major-13', nameEn: 'Death', nameBg: 'Смъртта', filename: '13 - Death_enhanced Medium.jpeg', uprightBg: 'Край и разпад — нещо приключва необратимо.', reversedBg: 'Вцепененост и застой; краят, който не се допуска да настъпи.' },
  { id: 'major-14', nameEn: 'Temperance', nameBg: 'Умереност', filename: '14 - Temperance_enhanced Medium.jpeg', uprightBg: 'Умереност, пестеливост и умение да съчетаваш.', reversedBg: 'Разединение и несполучливи съчетания на противоположни интереси.' },
  { id: 'major-15', nameEn: 'The Devil', nameBg: 'Дяволът', filename: '15 - The Devil_enhanced Medium.jpeg', uprightBg: 'Груба сила и неудържимост; предопределеност, която не е непременно зло.', reversedBg: 'Слабост, дребнавост и слепота за собственото положение.' },
  { id: 'major-16', nameEn: 'The Tower', nameBg: 'Кулата', filename: '16 - The Tower_enhanced Medium.jpeg', uprightBg: 'Бедствие и рухване — внезапна загуба, която не пита.', reversedBg: 'Същото, но задържано: потисничество и тирания без изход.' },
  { id: 'major-17', nameEn: 'The Star', nameBg: 'Звездата', filename: '17 - The Star_enhanced Medium.jpeg', uprightBg: 'Надежда и светли изгледи, примесени с усещане за лишение.', reversedBg: 'Надменност и безсилието, което се крие зад нея.' },
  { id: 'major-18', nameEn: 'The Moon', nameBg: 'Луната', filename: '18 - The Moon_enhanced Medium.jpeg', uprightBg: 'Скрити врагове, заблуда и страх в тъмното.', reversedBg: 'Непостоянство и мълчание; по-леки степени на същата заблуда.' },
  { id: 'major-19', nameEn: 'The Sun', nameBg: 'Слънцето', filename: '19 - The Sun_enhanced Medium.jpeg', uprightBg: 'Щастие, доволство и сполука в осезаемите неща.', reversedBg: 'Същото, но в по-малка мяра — радост, която не е пълна.' },
  { id: 'major-20', nameEn: 'Judgement', nameBg: 'Страшният съд', filename: '20 - Judgement_enhanced Medium.jpeg', uprightBg: 'Обновление и промяна на положението; нещо най-сетне се решава.', reversedBg: 'Малодушие и отлагане на решението.' },
  { id: 'major-21', nameEn: 'The World', nameBg: 'Светът', filename: '21 - The World_enhanced Medium.jpeg', uprightBg: 'Сигурен успех и завършек; пътуване или промяна на мястото.', reversedBg: 'Застой и неподвижност — оставане там, където си.' },
  { id: 'wands-01', nameEn: 'Ace of Wands', nameBg: 'Асо Жезли', filename: '1 - Ace of Wands_enhanced Medium.jpeg', uprightBg: 'Създаване и начало — изворът, от който тръгва начинанието.', reversedBg: 'Провал и упадък; радост, върху която е паднала сянка.' },
  { id: 'wands-02', nameEn: 'Two of Wands', nameBg: 'Двойка Жезли', filename: '2 - Two of Wands_enhanced Medium.jpeg', uprightBg: 'Богатство и величие — или тъкмо обратното: тегота и униние.', reversedBg: 'Изненада и вълнение, примесени със смут и страх.' },
  { id: 'wands-03', nameEn: 'Three of Wands', nameBg: 'Тройка Жезли', filename: '3 - Three of Wands_enhanced Medium.jpeg', uprightBg: 'Утвърдена сила и предприемчивост; корабите ти вече са отплавали.', reversedBg: 'Край на затрудненията — или край на труда и разочарование.' },
  { id: 'wands-04', nameEn: 'Four of Wands', nameBg: 'Четворка Жезли', filename: '4 - Four of Wands_enhanced Medium.jpeg', uprightBg: 'Мир, съгласие и празник в дома след свършена работа.', reversedBg: 'Значението остава същото: благополучие, разцвет и красота.' },
  { id: 'wands-05', nameEn: 'Five of Wands', nameBg: 'Петица Жезли', filename: '5 - Five of Wands_enhanced Medium.jpeg', uprightBg: 'Съперничество и борба — понякога само привидна битка.', reversedBg: 'Спорове, съдебни дела и хитруване.' },
  { id: 'wands-06', nameEn: 'Six of Wands', nameBg: 'Шестица Жезли', filename: '6 - Six of Wands_enhanced Medium.jpeg', uprightBg: 'Победа и признание; голяма новина, която идва.', reversedBg: 'Страх пред надвиснала загуба; предателство и нелоялност.' },
  { id: 'wands-07', nameEn: 'Seven of Wands', nameBg: 'Седмица Жезли', filename: '7 - Seven of Wands_enhanced Medium.jpeg', uprightBg: 'Доблест и успех срещу превъзхождащ противник.', reversedBg: 'Смут и тревога; предупреждение срещу нерешителност.' },
  { id: 'wands-08', nameEn: 'Eight of Wands', nameBg: 'Осмица Жезли', filename: '8 - Eight of Wands_enhanced Medium.jpeg', uprightBg: 'Бързина и устрем към край, който обещава сполука; стрелите на любовта.', reversedBg: 'Ревност, вътрешен спор и угризение.' },
  { id: 'wands-09', nameEn: 'Nine of Wands', nameBg: 'Деветка Жезли', filename: '9 - Nine of Wands_enhanced Medium.jpeg', uprightBg: 'Сила в отбрана; отлагане, но и готовност да посрещнеш удара.', reversedBg: 'Препятствия и несгода, които надделяват.' },
  { id: 'wands-10', nameEn: 'Ten of Wands', nameBg: 'Десетка Жезли', filename: '10 - Ten of Wands_enhanced Medium.jpeg', uprightBg: 'Товар и притеснение — и самият успех може да тежи.', reversedBg: 'Пречки, затруднения и интриги.' },
  { id: 'wands-11', nameEn: 'Page of Wands', nameBg: 'Паж Жезли', filename: 'Page of Wands_enhanced Medium.jpeg', uprightBg: 'Верен млад човек, пратеник или вест, която идва.', reversedBg: 'Лоша новина и нерешителността, която върви с нея.' },
  { id: 'wands-12', nameEn: 'Knight of Wands', nameBg: 'Рицар Жезли', filename: 'Knight of Wands_enhanced Medium.jpeg', uprightBg: 'Заминаване и смяна на място; млад приятелски настроен мъж.', reversedBg: 'Прекъсване, разрив и раздор.' },
  { id: 'wands-13', nameEn: 'Queen of Wands', nameBg: 'Дама Жезли', filename: 'Queen of Wands_enhanced Medium.jpeg', uprightBg: 'Приятелска и почтена жена; успех в работата и добра реколта.', reversedBg: 'Услужлива и пестелива — но и ревност, съпротива, дори измама.' },
  { id: 'wands-14', nameEn: 'King of Wands', nameBg: 'Крал Жезли', filename: 'King of Wands_enhanced Medium.jpeg', uprightBg: 'Честен и добронамерен мъж; вест за неочаквано наследство.', reversedBg: 'Добър, но суров — взискателност, смекчена от търпимост.' },
  { id: 'cups-01', nameEn: 'Ace of Cups', nameBg: 'Асо Купи', filename: '1 - Ace of Cups_enhanced Medium.jpeg', uprightBg: 'Дом на истинското сърце; радост, изобилие и утеха.', reversedBg: 'Дом на лъжливото сърце; непостоянство и обрат.' },
  { id: 'cups-02', nameEn: 'Two of Cups', nameBg: 'Двойка Купи', filename: '2 - Two of Cups_enhanced Medium.jpeg', uprightBg: 'Любов и съюз; съгласие между двама.', reversedBg: 'Похот и ревност — желание, което не се насища.' },
  { id: 'cups-03', nameEn: 'Three of Cups', nameBg: 'Тройка Купи', filename: '3 - Three of Cups_enhanced Medium.jpeg', uprightBg: 'Щастлив завършек в изобилие; изцеление и веселие.', reversedBg: 'Бързо приключване — и прекомерност в насладите.' },
  { id: 'cups-04', nameEn: 'Four of Cups', nameBg: 'Четворка Купи', filename: '4 - Four of Cups_enhanced Medium.jpeg', uprightBg: 'Досада и пресищане; предлага ти се нещо, но ти не го виждаш.', reversedBg: 'Новост и нови връзки; знак за нещо, което започва.' },
  { id: 'cups-05', nameEn: 'Five of Cups', nameBg: 'Петица Купи', filename: '5 - Five of Cups_enhanced Medium.jpeg', uprightBg: 'Загуба, при която все пак нещо остава; наследство под очакванията.', reversedBg: 'Вест и завръщане; нови връзки — или неверни планове.' },
  { id: 'cups-06', nameEn: 'Six of Cups', nameBg: 'Шестица Купи', filename: '6 - Six of Cups_enhanced Medium.jpeg', uprightBg: 'Спомен и поглед назад към щастие, което вече е отминало.', reversedBg: 'Бъдещето и обновлението — това, което тепърва предстои.' },
  { id: 'cups-07', nameEn: 'Seven of Cups', nameBg: 'Седмица Купи', filename: '7 - Seven of Cups_enhanced Medium.jpeg', uprightBg: 'Въображение и примамливи видения, зад които няма нищо трайно.', reversedBg: 'Желание и решимост, насочени към ясен замисъл.' },
  { id: 'cups-08', nameEn: 'Eight of Cups', nameBg: 'Осмица Купи', filename: '8 - Eight of Cups_enhanced Medium.jpeg', uprightBg: 'Оставяш нещо и си тръгваш; важното се оказва дребно.', reversedBg: 'Голяма радост, щастие и празник.' },
  { id: 'cups-09', nameEn: 'Nine of Cups', nameBg: 'Деветка Купи', filename: '9 - Nine of Cups_enhanced Medium.jpeg', uprightBg: 'Задоволство и сполука; желанието е изпълнено.', reversedBg: 'Искреност и свобода — но и грешки и несъвършенства.' },
  { id: 'cups-10', nameEn: 'Ten of Cups', nameBg: 'Десетка Купи', filename: '10 - Ten of Cups_enhanced Medium.jpeg', uprightBg: 'Пълно сърдечно доволство; съвършенство на любовта и приятелството.', reversedBg: 'Спокойствие на лъжливо сърце; възмущение и грубост.' },
  { id: 'cups-11', nameEn: 'Page of Cups', nameBg: 'Паж Купи', filename: 'Page of Cups_enhanced Medium.jpeg', uprightBg: 'Вест или послание; вглъбен млад човек, готов да услужи.', reversedBg: 'Привързаност, която подвежда; съблазън и хитрост.' },
  { id: 'cups-12', nameEn: 'Knight of Cups', nameBg: 'Рицар Купи', filename: 'Knight of Cups_enhanced Medium.jpeg', uprightBg: 'Приближаване и покана — предложение, което идва към теб.', reversedBg: 'Измама и лукавство под учтива форма.' },
  { id: 'cups-13', nameEn: 'Queen of Cups', nameBg: 'Дама Купи', filename: 'Queen of Cups_enhanced Medium.jpeg', uprightBg: 'Предана и любяща жена; дарба за виждане, щастие и добродетел.', reversedBg: 'Жена, на която не бива да се вярва; поквара и безчестие.' },
  { id: 'cups-14', nameEn: 'King of Cups', nameBg: 'Крал Купи', filename: 'King of Cups_enhanced Medium.jpeg', uprightBg: 'Отговорен и справедлив мъж на науката, правото или изкуството.', reversedBg: 'Двуличие и несправедливост; скандал и значителна загуба.' },
  { id: 'swords-01', nameEn: 'Ace of Swords', nameBg: 'Асо Мечове', filename: '1 - Ace of Swords_enhanced Medium.jpeg', uprightBg: 'Тържество на силата и на ясната мисъл, докарана до крайност.', reversedBg: 'Същата сила, но с гибелни последствия.' },
  { id: 'swords-02', nameEn: 'Two of Swords', nameBg: 'Двойка Мечове', filename: '2 - Two of Swords_enhanced Medium.jpeg', uprightBg: 'Равновесие, задържано насила; примирие с оръжие в ръка.', reversedBg: 'Лъжа и двуличие; съгласието се оказва привидно.' },
  { id: 'swords-03', nameEn: 'Three of Swords', nameBg: 'Тройка Мечове', filename: '3 - Three of Swords_enhanced Medium.jpeg', uprightBg: 'Раздяла и разрив; отсъствие, което боли.', reversedBg: 'Обърканост и разсеяност; загуба, която размътва ума.' },
  { id: 'swords-04', nameEn: 'Four of Swords', nameBg: 'Четворка Мечове', filename: '4 - Four of Swords_enhanced Medium.jpeg', uprightBg: 'Оттегляне и покой; самота, наложена или избрана.', reversedBg: 'Разумно управление и предпазливост — или скъперничество.' },
  { id: 'swords-05', nameEn: 'Five of Swords', nameBg: 'Петица Мечове', filename: '5 - Five of Swords_enhanced Medium.jpeg', uprightBg: 'Унижение и загуба; победа, платена с безчестие.', reversedBg: 'Същото, доведено докрай — погребение на онова, което е било.' },
  { id: 'swords-06', nameEn: 'Six of Swords', nameBg: 'Шестица Мечове', filename: '6 - Six of Swords_enhanced Medium.jpeg', uprightBg: 'Пътуване по вода; отдалечаване към по-спокойно място.', reversedBg: 'Признание и разгласяване; по едно тълкуване — обяснение в любов.' },
  { id: 'swords-07', nameEn: 'Seven of Swords', nameBg: 'Седмица Мечове', filename: '7 - Seven of Swords_enhanced Medium.jpeg', uprightBg: 'Замисъл и надежда, но и план, който може да се провали.', reversedBg: 'Добър съвет и наставление — или клюка и празнодумство.' },
  { id: 'swords-08', nameEn: 'Eight of Swords', nameBg: 'Осмица Мечове', filename: '8 - Eight of Swords_enhanced Medium.jpeg', uprightBg: 'Обвързаност и криза; сила, която е вързана и не може да се разгърне.', reversedBg: 'Безпокойство и съпротива; непредвидено събитие и предателство.' },
  { id: 'swords-09', nameEn: 'Nine of Swords', nameBg: 'Деветка Мечове', filename: '9 - Nine of Swords_enhanced Medium.jpeg', uprightBg: 'Отчаяние и безсъние; провал, забавяне и разочарование.', reversedBg: 'Съмнение и подозрение; страх, който има основание, и срам.' },
  { id: 'swords-10', nameEn: 'Ten of Swords', nameBg: 'Десетка Мечове', filename: '10 - Ten of Swords_enhanced Medium.jpeg', uprightBg: 'Болка, скръб и опустошение; краят е настъпил напълно.', reversedBg: 'Изгода и успех, които обаче не са трайни.' },
  { id: 'swords-11', nameEn: 'Page of Swords', nameBg: 'Паж Мечове', filename: 'Page of Swords_enhanced Medium.jpeg', uprightBg: 'Бдителност и наблюдение; разузнаване и проверка.', reversedBg: 'Същото в по-лоша светлина; непредвиденото те заварва неподготвен.' },
  { id: 'swords-12', nameEn: 'Knight of Swords', nameBg: 'Рицар Мечове', filename: 'Knight of Swords_enhanced Medium.jpeg', uprightBg: 'Смелост и умение в нападение; вражда, гняв и разрушение.', reversedBg: 'Безразсъдство и неспособност; прахосване на сила.' },
  { id: 'swords-13', nameEn: 'Queen of Swords', nameBg: 'Дама Мечове', filename: 'Queen of Swords_enhanced Medium.jpeg', uprightBg: 'Вдовство и печал; отсъствие, лишение и раздяла.', reversedBg: 'Злоба и предубеденост; преструвка и измама.' },
  { id: 'swords-14', nameEn: 'King of Swords', nameBg: 'Крал Мечове', filename: 'King of Swords_enhanced Medium.jpeg', uprightBg: 'Съждение и власт; воюващ разум, който налага закон.', reversedBg: 'Жестокост и вероломство; зъл умисъл зад властта.' },
  { id: 'pentacles-01', nameEn: 'Ace of Pentacles', nameBg: 'Асо Пентакли', filename: '1 - Ace of Pentacles_enhanced Medium.jpeg', uprightBg: 'Съвършено доволство и осезаема сполука; злато в ръката.', reversedBg: 'Тъмната страна на богатството; изобилие, което не носи полза.' },
  { id: 'pentacles-02', nameEn: 'Two of Pentacles', nameBg: 'Двойка Пентакли', filename: '2 - Two of Pentacles_enhanced Medium.jpeg', uprightBg: 'Ловко балансиране и веселие; писмени вести и дребни пречки.', reversedBg: 'Престорена веселост; писма и разменни книжа.' },
  { id: 'pentacles-03', nameEn: 'Three of Pentacles', nameBg: 'Тройка Пентакли', filename: '3 - Three of Pentacles_enhanced Medium.jpeg', uprightBg: 'Майсторство и признат труд; слава, спечелена с работа.', reversedBg: 'Посредственост и дребнавост в работата.' },
  { id: 'pentacles-04', nameEn: 'Four of Pentacles', nameBg: 'Четворка Пентакли', filename: '4 - Four of Pentacles_enhanced Medium.jpeg', uprightBg: 'Здраво държане на притежанието; дар или наследство.', reversedBg: 'Отлагане и съпротива; хватката се разхлабва.' },
  { id: 'pentacles-05', nameEn: 'Five of Pentacles', nameBg: 'Петица Пентакли', filename: '5 - Five of Pentacles_enhanced Medium.jpeg', uprightBg: 'Материална нужда — но и близост, намерена в самата нея.', reversedBg: 'Безпорядък и разруха; разсипничество и раздор.' },
  { id: 'pentacles-06', nameEn: 'Six of Pentacles', nameBg: 'Шестица Пентакли', filename: '6 - Six of Pentacles_enhanced Medium.jpeg', uprightBg: 'Дар и щедрост; сегашно благополучие, което се споделя.', reversedBg: 'Завист и алчност; илюзия за това какво ти се полага.' },
  { id: 'pentacles-07', nameEn: 'Seven of Pentacles', nameBg: 'Седмица Пентакли', filename: '7 - Seven of Pentacles_enhanced Medium.jpeg', uprightBg: 'Пари и размяна; изчакване над онова, което си отгледал.', reversedBg: 'Тревога за пари, които предстой да дадеш назаем.' },
  { id: 'pentacles-08', nameEn: 'Eight of Pentacles', nameBg: 'Осмица Пентакли', filename: '8 - Eight of Pentacles_enhanced Medium.jpeg', uprightBg: 'Работа и занаят; умение, което още се усъвършенства.', reversedBg: 'Осуетена амбиция и суета; умение, обърнато към хитрост.' },
  { id: 'pentacles-09', nameEn: 'Nine of Pentacles', nameBg: 'Деветка Пентакли', filename: '9 - Nine of Pentacles_enhanced Medium.jpeg', uprightBg: 'Благополучие, постигнато само; сигурност и различаване.', reversedBg: 'Измама и провален замисъл; недобросъвестност.' },
  { id: 'pentacles-10', nameEn: 'Ten of Pentacles', nameBg: 'Десетка Пентакли', filename: '10 - Ten of Pentacles_enhanced Medium.jpeg', uprightBg: 'Богатство и родов дом; онова, което се предава на потомството.', reversedBg: 'Случайност и загуба; хазарт — или неочакван дар.' },
  { id: 'pentacles-11', nameEn: 'Page of Pentacles', nameBg: 'Паж Пентакли', filename: 'Page of Pentacles_enhanced Medium.jpeg', uprightBg: 'Прилежание и учение; вглъбяване в нещо практично.', reversedBg: 'Разточителство и разпиляване; неблагоприятна вест.' },
  { id: 'pentacles-12', nameEn: 'Knight of Pentacles', nameBg: 'Рицар Пентакли', filename: 'Knight of Pentacles_enhanced Medium.jpeg', uprightBg: 'Полезност, отговорност и почтеност в делата.', reversedBg: 'Бездействие и застой; отпуснатост и обезсърчение.' },
  { id: 'pentacles-13', nameEn: 'Queen of Pentacles', nameBg: 'Дама Пентакли', filename: 'Queen of Pentacles_enhanced Medium.jpeg', uprightBg: 'Заможност, щедрост и сигурност.', reversedBg: 'Подозрение и недоверие; страх да не изгубиш.' },
  { id: 'pentacles-14', nameEn: 'King of Pentacles', nameBg: 'Крал Пентакли', filename: 'King of Pentacles_enhanced Medium.jpeg', uprightBg: 'Делови ум и осъществяване; успех в сметките и в занаята.', reversedBg: 'Слабост и поквара; опасност, породена от алчност.' },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let lastSpread = null;

function drawThreeCards() {
  let candidates = shuffle(DECK);

  while (
    candidates[0].id === candidates[1].id ||
    candidates[0].id === candidates[2].id ||
    candidates[1].id === candidates[2].id
  ) {
    candidates = shuffle(DECK);
  }

  if (lastSpread && (
    candidates[0].id === lastSpread[0].id ||
    candidates[1].id === lastSpread[1].id ||
    candidates[2].id === lastSpread[2].id
  )) {
    return drawThreeCards();
  }

  lastSpread = [candidates[0], candidates[1], candidates[2]];

  return lastSpread.map(card => ({
    ...card,
    reversed: Math.random() < 0.5
  }));
}

async function revealCard(cardElement, card) {
  const cardFront = cardElement.querySelector('.card__front');
  const img = document.createElement('img');
  img.src = IMAGE_BASE + card.filename;
  img.alt = card.nameBg + (card.reversed ? ' обърната' : '');

  try {
    await img.decode();
    cardFront.innerHTML = '';
    cardFront.appendChild(img);

    if (card.reversed) {
      img.style.transform = 'rotate(180deg)';
    }
  } catch (err) {
    console.log(`Failed to load ${card.filename}`);
    cardFront.innerHTML = '';
    const text = document.createElement('div');
    text.style.padding = '20px';
    text.style.textAlign = 'center';
    text.style.color = 'var(--muted-foreground)';
    text.textContent = card.nameBg;
    cardFront.appendChild(text);
  }

  cardElement.classList.add('is-revealed');
}

async function showSpread() {
  const cards = drawThreeCards();
  const cardElements = document.querySelectorAll('.tarot .card');

  for (let i = 0; i < 3; i++) {
    const cardElement = cardElements[i];
    const card = cards[i];

    cardElement.classList.remove('is-revealed');

    setTimeout(async () => {
      await revealCard(cardElement, card);

      const nameEl = document.getElementById(`card-name-${i + 1}`);
      const statusEl = document.getElementById(`card-status-${i + 1}`);
      if (nameEl) nameEl.textContent = card.nameBg;
      if (statusEl) statusEl.textContent = card.reversed ? 'Обърната' : 'Изправена';
    }, i * 140);
  }

  setTimeout(() => {
    document.getElementById('tarot-meanings').innerHTML = cards.map((card) => `
      <div class="tarot-meaning">
        <h4>${card.nameBg}</h4>
        <p style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 0.5rem;">${card.reversed ? 'Обърната' : 'Изправена'}</p>
        <p style="font-size: 0.875rem; line-height: 1.5;">${card.reversed ? card.reversedBg : card.uprightBg}</p>
      </div>
    `).join('');
  }, 500);
}

window.initTarot = function() {
  const drawBtn = document.getElementById('tarot-draw-btn');
  if (drawBtn) {
    drawBtn.addEventListener('click', showSpread);
  }
};
