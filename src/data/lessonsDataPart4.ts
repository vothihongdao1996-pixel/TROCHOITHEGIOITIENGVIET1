import { LessonTopic } from '../types';

/**
 * BỔ SUNG CÁC BÀI HỌC TỪ TUẦN 8 ĐẾN TUẦN 17 (HỌC KÌ I TIẾP THEO)
 * VÀ CÁC CHỦ ĐIỂM HỌC KÌ II (TỪ BÀI ĐỌC ĐẾN ÔN TẬP CUỐI NĂM)
 * THEO BỘ SÁCH GIÁO KHOA TIẾNG VIỆT 1 - KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
 * Chuẩn CT GDPT 2018 - Đầy đủ 7 bước sư phạm, phát âm chuẩn ngữ cảnh lớp 1
 */
export const SEMESTER_1_PART4_AND_SEMESTER_2_LESSONS: LessonTopic[] = [
  // ==========================================
  // TUẦN 8: BÀI 36 ĐẾN BÀI 40 (CÁC VẦN OM, ÔM, ƠM, EM, ÊM, IM, UM, AI, AY, ÂY, OI, ÔI, ƠI)
  // ==========================================
  {
    id: 'bai-36',
    week: 8,
    lessonNumber: 36,
    unitTitle: 'Tuần 8 • Bài 36',
    title: 'om, ôm, ơm',
    subtitle: 'Làm quen 3 vần có âm cuối m: o-m (om), ô-m (ôm) và ơ-m (ơm)',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['om', 'ôm', 'ơm'],
    introStory: 'Đom Đóm thắp đèn lung linh bên đống rơm vàng óng, mâm cơm gia đình bốc khói nghi ngút thơm lừng!',
    introImageKey: 'phonics-workshop',
    sampleWords: [
      { word: 'đom đóm', meaning: 'Côn trùng phát sáng ban đêm', audioText: 'đom đóm' },
      { word: 'đống rơm', meaning: 'Đống rơm vàng sau mùa gặt', audioText: 'đống rơm' },
      { word: 'bát cơm', meaning: 'Bát cơm dẻo thơm của mẹ', audioText: 'bát cơm' },
      { word: 'ôm ấp', meaning: 'Mẹ ôm bé vào lòng âu yếm', audioText: 'ôm ấp' },
    ],
    pronunciationNotes: [
      {
        sound: 'vần /om, ôm, ơm/',
        mouthShape: 'Phát âm âm chính tròn môi rồi khép chặt hai môi lại ở âm m.',
        speechText: 'o mờ om, ô mờ ôm, ơ mờ ơm',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những từ có chứa vần "ơm":',
      prompt: 'Tìm từ có vần ơm:',
      items: [
        { text: 'đống rơm', isCorrect: true, hint: 'Đúng rồi! "rơm" có vần ơm.' },
        { text: 'đom đóm', isCorrect: false, hint: '"đom đóm" có vần om.' },
        { text: 'bát cơm', isCorrect: true, hint: 'Chính xác! "cơm" có vần ơm.' },
        { text: 'ôm chặt', isCorrect: false, hint: '"ôm" có vần ôm.' },
        { text: 'thơm ngát', isCorrect: true, hint: 'Tuyệt vời! "thơm" có vần ơm.' },
      ],
    },
    recommendedGameId: 13,
    recommendedGameTitle: 'Ghép vần om, ôm, ơm với các tiếng',
    practiceQuestions: [
      {
        id: 3601,
        instruction: 'Ghép âm đ với vần om và dấu sắc tạo thành tiếng gì?',
        questionContent: 'đ + om + dấu sắc = ?',
        options: ['đóm', 'đòm', 'đỏm', 'độm'],
        correctIndex: 0,
        explanation: 'đ ghép với om và dấu sắc tạo thành tiếng "đóm".',
      },
    ],
  },
  {
    id: 'bai-38',
    week: 8,
    lessonNumber: 38,
    unitTitle: 'Tuần 8 • Bài 38',
    title: 'ai, ay, ây',
    subtitle: 'Làm quen 3 vần có âm cuối i/y: a-i (ai), a-y (ay) và â-y (ây)',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['ai', 'ay', 'ây'],
    introStory: 'Đôi Bàn Tay xinh xắn trồng Cây Xanh mát trước sân nhà, bé chăm chỉ tưới nước mỗi Mai thức dậy!',
    introImageKey: 'phonics-workshop',
    sampleWords: [
      { word: 'bàn tay', meaning: 'Đôi bàn tay khéo léo', audioText: 'bàn tay' },
      { word: 'cây xanh', meaning: 'Cây cối xanh tốt tỏa bóng', audioText: 'cây xanh' },
      { word: 'ngày mai', meaning: 'Tương lai tươi sáng phía trước', audioText: 'ngày mai' },
      { word: 'máy bay', meaning: 'Chiếc máy bay trên bầu trời', audioText: 'máy bay' },
    ],
    pronunciationNotes: [
      {
        sound: 'vần /ai, ay, ây/',
        mouthShape: 'Đọc lướt nhanh từ nguyên âm chính sang âm cuối i/y.',
        speechText: 'a i ai, a y dài ay, ớ y dài ây',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những tiếng có chứa vần "ay":',
      prompt: 'Tìm tiếng có vần ay:',
      items: [
        { text: 'bàn tay', isCorrect: true, hint: 'Đúng rồi! "tay" có vần ay.' },
        { text: 'ngày mai', isCorrect: false, hint: '"mai" có vần ai.' },
        { text: 'máy bay', isCorrect: true, hint: 'Chính xác! Cả hai tiếng đều có vần ay.' },
        { text: 'cây bàng', isCorrect: false, hint: '"cây" có vần ây.' },
        { text: 'chạy nhảy', isCorrect: true, hint: 'Tuyệt vời! Đều có vần ay.' },
      ],
    },
    recommendedGameId: 13,
    recommendedGameTitle: 'Phân biệt vần ai, ay và ây',
    practiceQuestions: [
      {
        id: 3801,
        instruction: 'Điền vần ai hay ay vào câu: "Bé rửa sạch đôi bàn t... trước khi ăn cơm."',
        questionContent: 'Chọn vần điền vào chỗ trống: bàn t...',
        options: ['ai', 'ay', 'ây', 'am'],
        correctIndex: 1,
        explanation: 'Điền vần ay để tạo thành từ "bàn tay".',
      },
    ],
  },
  {
    id: 'bai-40',
    week: 8,
    lessonNumber: 40,
    unitTitle: 'Tuần 8 • Bài 40',
    title: 'Ôn tập và kể chuyện Tuần 8',
    subtitle: 'Ôn tập hệ thống các vần om, ôm, ơm, em, êm, im, um, ai, ay, ây, oi, ôi, ơi',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['om', 'ơm', 'ay', 'ây', 'oi', 'ơi'],
    introStory: 'Lễ hội hoa trái miệt vườn rộn rã tiếng cười, các bạn nhỏ thi tài đố chữ và nghe kể câu chuyện bổ ích về tình làng nghĩa xóm!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'chùm ổi', meaning: 'Ổi găng giòn ngọt', audioText: 'chùm ổi' },
      { word: 'trái bưởi', meaning: 'Quả bưởi da xanh mát lành', audioText: 'trái bưởi' },
      { word: 'thôn xóm', meaning: 'Làng quê yên ả chan hòa', audioText: 'thôn xóm' },
      { word: 'yêu mến', meaning: 'Tình cảm thân thương gắn bó', audioText: 'yêu mến' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc trơn cụm từ',
        mouthShape: 'Đọc diễn cảm rõ ràng từng tiếng trong câu dài vừa phải.',
        speechText: 'Quê em vào mùa gặt, hương lúa mới thơm lừng thôn xóm.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những từ viết đúng chính tả:',
      prompt: 'Tìm từ đúng chính tả:',
      items: [
        { text: 'đom đóm', isCorrect: true, hint: 'Đúng rồi!' },
        { text: 'cây xenh', isCorrect: false, hint: 'Sai! Phải viết "cây xanh".' },
        { text: 'bàn tay', isCorrect: true, hint: 'Chính xác!' },
        { text: 'máy bai', isCorrect: false, hint: 'Sai! Phải viết "máy bay".' },
        { text: 'trái bưởi', isCorrect: true, hint: 'Tuyệt vời!' },
      ],
    },
    recommendedGameId: 29,
    recommendedGameTitle: 'Đọc từ tìm tranh ôn tập tổng hợp',
    practiceQuestions: [
      {
        id: 4001,
        instruction: 'Chọn từ ghép hoàn chỉnh thích hợp: "hương lúa ..."',
        questionContent: 'Chọn từ điền tiếp: hương lúa ...',
        options: ['mới', 'non', 'xanh', 'ngọt'],
        correctIndex: 0,
        explanation: 'Thành ngữ quen thuộc: "hương lúa mới" thơm ngát.',
      },
    ],
  },

  // ==========================================
  // TUẦN 9 & 10: VẦN CÓ ÂM CUỐI C, T, P (ac, at, ap, v.v.)
  // ==========================================
  {
    id: 'bai-46',
    week: 10,
    lessonNumber: 46,
    unitTitle: 'Tuần 10 • Bài 46',
    title: 'ac, ăc, âc',
    subtitle: 'Làm quen 3 vần có âm cuối c (cờ): a-c (ac), ă-c (ăc) và â-c (âc)',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['ac', 'ăc', 'âc'],
    introStory: 'Chú Vạc lặn lội bờ sông, chiếc Cầu Lắc Léo bắc qua con rạch, Bậc Thang đá dẫn lên chùa cổ thanh tịnh!',
    introImageKey: 'phonics-workshop',
    sampleWords: [
      { word: 'con vạc', meaning: 'Chim vạc ăn đêm bên bờ sông', audioText: 'con vạc' },
      { word: 'cầu lắc', meaning: 'Cây cầu khỉ lắc lẻo miền Tây', audioText: 'cầu lắc' },
      { word: 'bậc thang', meaning: 'Bậc đá bước lên nhà cao', audioText: 'bậc thang' },
      { word: 'quả gấc', meaning: 'Gấc chín đỏ đồ xôi thơm', audioText: 'quả gấc' },
    ],
    pronunciationNotes: [
      {
        sound: 'vần /ac, ăc, âc/',
        mouthShape: 'Âm cuối c là âm tắc, nâng cuống lưỡi chạm ngạc mềm chặn luồng hơi lại.',
        speechText: 'a cờ ac, á cờ ăc, ớ cờ âc',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những từ có chứa vần "âc":',
      prompt: 'Tìm từ có vần âc:',
      items: [
        { text: 'quả gấc', isCorrect: true, hint: 'Đúng rồi! "gấc" có vần âc.' },
        { text: 'con vạc', isCorrect: false, hint: '"vạc" có vần ac.' },
        { text: 'bậc thang', isCorrect: true, hint: 'Chính xác! "bậc" có vần âc.' },
        { text: 'lắc lư', isCorrect: false, hint: '"lắc" có vần ăc.' },
        { text: 'giấc mơ', isCorrect: true, hint: 'Tuyệt vời! "giấc" có vần âc.' },
      ],
    },
    recommendedGameId: 13,
    recommendedGameTitle: 'Nối vần ac, ăc, âc với tranh',
    practiceQuestions: [
      {
        id: 4601,
        instruction: 'Các vần có âm cuối "c" chỉ đi được với những dấu thanh nào?',
        questionContent: 'Vần có âm cuối c chỉ ghép với thanh nào?',
        options: ['Huyền và hỏi', 'Sắc và nặng', 'Ngã và hỏi', 'Tất cả các thanh'],
        correctIndex: 1,
        explanation: 'Quy tắc ngữ âm: Tiếng có âm cuối c (ac, ăc, âc, oc...) chỉ mang được 2 thanh: thanh sắc và thanh nặng.',
      },
    ],
  },
  {
    id: 'bai-59',
    week: 12,
    lessonNumber: 59,
    unitTitle: 'Tuần 12 • Bài 59',
    title: 'ang, ăng, âng',
    subtitle: 'Làm quen 3 vần có âm cuối ng: a-ng (ang), ă-ng (ăng) và â-ng (âng)',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['ang', 'ăng', 'âng'],
    introStory: 'Vầng Trăng sáng vằng vặc trên đỉnh đồi, cây Bàng già che mát góc sân, các bạn nhỏ cất cao tiếng ca dâng tặng thầy cô!',
    introImageKey: 'phonics-workshop',
    sampleWords: [
      { word: 'cây bàng', meaning: 'Cây bàng trường em', audioText: 'cây bàng' },
      { word: 'vầng trăng', meaning: 'Ánh trăng rằm sáng trong', audioText: 'vầng trăng' },
      { word: 'vâng lời', meaning: 'Biết vâng lời cha mẹ dạy bảo', audioText: 'vâng lời' },
      { word: 'măng non', meaning: 'Búp măng tre nhú xanh', audioText: 'măng non' },
    ],
    pronunciationNotes: [
      {
        sound: 'vần /ang, ăng, âng/',
        mouthShape: 'Cuống lưỡi nâng lên chạm ngạc mềm, âm mũi ngân dài vang trong họng.',
        speechText: 'a ngờ ang, á ngờ ăng, ớ ngờ âng',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những từ có chứa vần "ăng":',
      prompt: 'Tìm từ có vần ăng:',
      items: [
        { text: 'vầng trăng', isCorrect: true, hint: 'Đúng rồi! "trăng" có vần ăng.' },
        { text: 'cây bàng', isCorrect: false, hint: '"bàng" có vần ang.' },
        { text: 'măng tre', isCorrect: true, hint: 'Chính xác! "măng" có vần ăng.' },
        { text: 'vâng lời', isCorrect: false, hint: '"vâng" có vần âng.' },
        { text: 'hàm răng', isCorrect: true, hint: 'Tuyệt vời! "răng" có vần ăng.' },
      ],
    },
    recommendedGameId: 18,
    recommendedGameTitle: 'Tàu lửa chở vần ang, ăng, âng',
    practiceQuestions: [
      {
        id: 5901,
        instruction: 'Ghép âm tr với vần ăng và dấu huyền tạo thành tiếng gì?',
        questionContent: 'tr + ăng + dấu huyền = ?',
        options: ['trằng', 'trắng', 'trẳng', 'trặng'],
        correctIndex: 0,
        explanation: 'tr ghép với ăng và dấu huyền tạo thành tiếng "trằng".',
      },
    ],
  },
  {
    id: 'bai-61',
    week: 13,
    lessonNumber: 61,
    unitTitle: 'Tuần 13 • Bài 61',
    title: 'ong, ông, ung, ưng',
    subtitle: 'Làm quen 4 vần tròn môi và vang: o-ng, ô-ng, u-ng và ư-ng',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['ong', 'ông', 'ung', 'ưng'],
    introStory: 'Những Bông Hồng nhung Rung Rinh trong làn gió mát, chiếc Chong Chóng quay tít trên tay bé, nồi Bánh Chưng ngày Tết tỏa khói thơm lừng!',
    introImageKey: 'phonics-workshop',
    sampleWords: [
      { word: 'chong chóng', meaning: 'Đồ chơi quay tít trước gió', audioText: 'chong chóng' },
      { word: 'bông hồng', meaning: 'Hoa hồng nhung đỏ thắm', audioText: 'bông hồng' },
      { word: 'bánh chưng', meaning: 'Bánh chưng xanh ngày Tết cổ truyền', audioText: 'bánh chưng' },
      { word: 'bông súng', meaning: 'Hoa súng tím nở rộ mặt hồ', audioText: 'bông súng' },
    ],
    pronunciationNotes: [
      {
        sound: 'vần /ong, ông, ung, ưng/',
        mouthShape: 'Đọc tròn môi ở ong, ông, ung rồi ngậm vòm họng đẩy hơi qua mũi tạo tiếng vang.',
        speechText: 'o ngờ ong, ô ngờ ông, u ngờ ung, ư ngờ ưng',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những từ có chứa vần "ưng":',
      prompt: 'Tìm từ có vần ưng:',
      items: [
        { text: 'bánh chưng', isCorrect: true, hint: 'Đúng rồi! "chưng" có vần ưng.' },
        { text: 'bông hồng', isCorrect: false, hint: '"hồng" có vần ông.' },
        { text: 'rừng cây', isCorrect: true, hint: 'Chính xác! "rừng" có vần ưng.' },
        { text: 'chong chóng', isCorrect: false, hint: '"chóng" có vần ong.' },
        { text: 'vui mừng', isCorrect: true, hint: 'Tuyệt vời! "mừng" có vần ưng.' },
      ],
    },
    recommendedGameId: 18,
    recommendedGameTitle: 'Tàu lửa chở vần ong - ông - ung - ưng',
    practiceQuestions: [
      {
        id: 6101,
        instruction: 'Đọc câu và chọn từ có vần "ưng": "Bé cùng mẹ gói bánh chưng đón Tết."',
        questionContent: 'Từ nào trong câu có vần ưng?',
        options: ['cùng', 'bánh', 'chưng', 'Tết'],
        correctIndex: 2,
        explanation: 'Tiếng "chưng" có vần ưng (ch + ưng = chưng).',
      },
    ],
  },
  {
    id: 'bai-70',
    week: 15,
    lessonNumber: 70,
    unitTitle: 'Tuần 15 • Bài 70',
    title: 'Ôn tập và kể chuyện: Chuột nhà và chuột đồng',
    subtitle: 'Ôn tập uôm, uôn, uông, uôi, ươi, ươu và nghe chuyện Chuột nhà và chuột đồng',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['uôn', 'uông', 'uôi', 'ươi', 'ươu'],
    introStory: 'Chuột nhà lên phố ăn thức ăn ngon nhưng luôn sợ hãi mèo và bẫy rập. Chuột đồng sống ở đồng quê ăn bông lúa, củ khoai đạm bạc mà tâm hồn thanh thản, tự do!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'chuột đồng', meaning: 'Chú chuột sống tự do nơi ruộng đồng', audioText: 'chuột đồng' },
      { word: 'chuột nhà', meaning: 'Chuột sống trong căn nhà thành phố', audioText: 'chuột nhà' },
      { word: 'thanh thản', meaning: 'Yên bình không lo sợ', audioText: 'thanh thản' },
      { word: 'tự do', meaning: 'Không bị giam cầm sợ sệt', audioText: 'tự do' },
    ],
    pronunciationNotes: [
      {
        sound: 'Bài học',
        mouthShape: 'Đọc diễn cảm, nhấn mạnh giá trị của cuộc sống bình yên, tự do.',
        speechText: 'Thà ăn đạm bạc mà được tự do, bình yên còn hơn sống sung sướng trong sợ hãi.',
      },
    ],
    interactiveActivity: {
      instruction: 'Vì sao chuột đồng quyết định quay về cánh đồng quê hương?',
      prompt: 'Lý do chuột đồng trở về quê:',
      items: [
        { text: 'Vì ở quê tuy đạm bạc nhưng được sống yên bình, tự do', isCorrect: true, hint: 'Đúng rồi! Bình yên tự do là quý giá nhất.' },
        { text: 'Vì ở nhà phố không có thức ăn', isCorrect: false, hint: 'Ở phố nhiều món ngon nhưng luôn phải chạy trốn mèo và chó dữ.' },
        { text: 'Vì không muốn sống trong cảnh nơm nớp lo sợ hiểm nguy', isCorrect: true, hint: 'Chính xác! Lo sợ mất mạng thì thức ăn ngon mấy cũng chẳng vui.' },
      ],
    },
    recommendedGameId: 32,
    recommendedGameTitle: 'Sắp xếp câu chuyện Chuột nhà và chuột đồng',
    practiceQuestions: [
      {
        id: 7001,
        instruction: 'Bài học ý nghĩa nhất của truyện Chuột nhà và chuột đồng là:',
        questionContent: 'Ý nghĩa câu chuyện:',
        options: ['Phải tích trữ nhiều đồ ăn', 'Cuộc sống tự do, thanh thản quý hơn mọi của ngon vật lạ mà luôn sống trong lo âu', 'Nên ở thành phố', 'Chuột nào cũng giống nhau'],
        correctIndex: 1,
        explanation: 'Chuột đồng thà sống thanh thản nơi đồng quê còn hơn chịu đựng nguy hiểm nơi phố thị phồn hoa.',
      },
    ],
  },
  {
    id: 'bai-80',
    week: 17,
    lessonNumber: 80,
    unitTitle: 'Tuần 17 • Bài 80',
    title: 'Ôn tập học kì I và kể chuyện: Sừng và chân',
    subtitle: 'Tổng kết toàn diện học kì I môn Tiếng Việt 1 và nghe chuyện Sừng và chân của chú Hươu',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống',
    letters: ['oan', 'oat', 'oai', 'oay', 'uê', 'uy'],
    introStory: 'Chú hươu luôn tự hào về cặp sừng lộng lẫy và chê bốn chiếc chân khẳng khiu xấu xí. Khi bị sư tử đuổi, chính bốn chân nhanh thoăn thoắt đã cứu mạng hươu, còn cặp sừng lại vướng vào bụi cây!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'cặp sừng', meaning: 'Sừng hươu tỏa nhánh đẹp đẽ', audioText: 'cặp sừng' },
      { word: 'đôi chân', meaning: 'Bốn chân chạy nhanh thoăn thoắt', audioText: 'đôi chân' },
      { word: 'thoát nạn', meaning: 'Chạy thoát khỏi móng vuốt sư tử', audioText: 'thoát nạn' },
      { word: 'bài học', meaning: 'Bài học nhận thức sâu sắc', audioText: 'bài học' },
    ],
    pronunciationNotes: [
      {
        sound: 'Tổng kết học kì I',
        mouthShape: 'Đọc trơn lưu loát câu văn dài: Xuân về, hoa đào nở thắm, cây quất trĩu quả vàng rực rỡ.',
        speechText: 'Xuân về, hoa đào nở thắm, cây quất trĩu quả vàng rực rỡ.',
      },
    ],
    interactiveActivity: {
      instruction: 'Chi tiết nào đã cứu sống chú hươu trong gang tấc?',
      prompt: 'Điều đã giúp hươu thoát hiểm:',
      items: [
        { text: 'Bốn chiếc chân khẳng khiu chạy nhanh thoăn thoắt', isCorrect: true, hint: 'Đúng rồi! Đôi chân tưởng xấu xí lại chạy rất khỏe.' },
        { text: 'Cặp sừng lộng lẫy', isCorrect: false, hint: 'Cặp sừng suýt hại chết hươu vì bị mắc vào cành cây rậm rạp!' },
        { text: 'Hươu biết rút ra bài học không đánh giá sự vật chỉ qua vẻ bề ngoài', isCorrect: true, hint: 'Chính xác! Cái gì hữu ích cho ta mới thực sự quý giá.' },
      ],
    },
    recommendedGameId: 35,
    recommendedGameTitle: 'Thử thách Trạng nguyên nhí tổng kết Học kì I',
    practiceQuestions: [
      {
        id: 8001,
        instruction: 'Bài học mà chú hươu nhận ra sau khi thoát nạn là:',
        questionContent: 'Hươu hiểu ra điều gì?',
        options: ['Sừng đẹp hơn chân', 'Không nên kiêu ngạo, vẻ bề ngoài không quan trọng bằng giá trị thực tế hữu ích', 'Nên bẻ gãy sừng đi', 'Không bao giờ chạy nữa'],
        correctIndex: 1,
        explanation: 'Cặp sừng đẹp nhưng làm vướng víu; bốn chân khẳng khiu tuy thô ráp nhưng lại cứu sống cả sinh mạng.',
      },
    ],
  },

  // ==========================================
  // HỌC KÌ II: CÁC CHỦ ĐIỂM LUYỆN ĐỌC HIỂU & BÀI HỌC CUỘC SỐNG (TUẦN 19 ĐẾN TUẦN 35)
  // ==========================================
  // CHỦ ĐIỂM 1: TÔI VÀ CÁC BẠN (TUẦN 19 - 20)
  {
    id: 'hk2-chu-diem-1',
    week: 19,
    lessonNumber: 81,
    unitTitle: 'Tuần 19 • Bài 1 (Học kì II)',
    title: 'Tôi là học sinh lớp 1',
    subtitle: 'Chủ điểm Tôi và các bạn: Niềm vui, sự tự tin và niềm tự hào khi bước vào ngưỡng cửa lớp 1',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['lớp 1', 'tự tin', 'bạn bè'],
    introStory: 'Hôm nay bước vào học kì 2, em đã đọc thông viết thạo, biết làm toán và có thật nhiều bạn mới thân thương. Em tự hào cất tiếng: "Tôi là học sinh lớp 1!"',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'học sinh', meaning: 'Người học trò chăm ngoan dưới mái trường', audioText: 'học sinh' },
      { word: 'sách vở', meaning: 'Đồ dùng học tập thân thiết hàng ngày', audioText: 'sách vở' },
      { word: 'thầy cô', meaning: 'Người cha, người mẹ thứ hai dạy dỗ em', audioText: 'thầy cô' },
      { word: 'bạn bè', meaning: 'Những người bạn cùng học, cùng chơi chan hòa', audioText: 'bạn bè' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc diễn cảm',
        mouthShape: 'Đọc to, rõ ràng, dõng dạc, thể hiện sự vui tươi và tự tin.',
        speechText: 'Tôi là học sinh lớp một. Tôi yêu trường, yêu lớp và yêu quý bạn bè.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những việc làm thể hiện một người học sinh gương mẫu:',
      prompt: 'Việc làm tốt của học sinh lớp 1:',
      items: [
        { text: 'Chăm chỉ học bài và giữ gìn sách vở sạch đẹp', isCorrect: true, hint: 'Đúng rồi! Vở sạch chữ đẹp, học hành tiến bộ.' },
        { text: 'Đi học muộn và quên sách vở', isCorrect: false, hint: 'Không nên đi muộn con nhé.' },
        { text: 'Lễ phép chào hỏi thầy cô và chan hòa với bạn bè', isCorrect: true, hint: 'Chính xác! Con ngoan trò giỏi lễ phép.' },
        { text: 'Giữ gìn vệ sinh lớp học và sân trường', isCorrect: true, hint: 'Tuyệt vời! Bảo vệ môi trường học đường.' },
      ],
    },
    recommendedGameId: 30,
    recommendedGameTitle: 'Sắp xếp câu: Tôi là học sinh lớp 1',
    practiceQuestions: [
      {
        id: 8101,
        instruction: 'Đọc và chọn từ ngữ miêu tả niềm vui ngày đầu đi học:',
        questionContent: 'Tâm trạng của bạn nhỏ khi đến trường:',
        options: ['Buồn bã lo âu', 'Hân hoan, háo hức và tràn ngập niềm vui', 'Muốn ở nhà ngủ', 'Khóc lóc'],
        correctIndex: 1,
        explanation: 'Được đến trường gặp thầy cô, bạn bè là niềm vui hân hoan rực rỡ.',
      },
    ],
  },
  // CHỦ ĐIỂM 2: MÁI ẤM GIA ĐÌNH (TUẦN 21 - 22)
  {
    id: 'hk2-chu-diem-2',
    week: 21,
    lessonNumber: 86,
    unitTitle: 'Tuần 21 • Bài 1 (Học kì II)',
    title: 'Nụ hôn trên bàn tay',
    subtitle: 'Chủ điểm Mái ấm gia đình: Tình yêu thương bao la và sự ấm áp của bàn tay mẹ hiền',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['mái ấm', 'tình mẹ', 'yêu thương'],
    introStory: 'Trước khi đến lớp, mẹ đặt một nụ hôn ấm áp vào lòng bàn tay nhỏ của bé. Khi nào nhớ mẹ, bé chỉ cần áp bàn tay lên má là cảm thấy mẹ đang ở ngay bên cạnh!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'bàn tay mẹ', meaning: 'Bàn tay chăm sóc bồng bế con khôn lớn', audioText: 'bàn tay mẹ' },
      { word: 'nụ hôn', meaning: 'Cái thơm ấm áp tràn đầy yêu thương', audioText: 'nụ hôn' },
      { word: 'ấm áp', meaning: 'Cảm giác che chở bình yên', audioText: 'ấm áp' },
      { word: 'gia đình', meaning: 'Mái ấm có ông bà, cha mẹ và các con', audioText: 'gia đình' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc truyền cảm',
        mouthShape: 'Giọng đọc nhẹ nhàng, ấm áp, giàu cảm xúc yêu thương gia đình.',
        speechText: 'Nụ hôn của mẹ theo em vào tận lớp học, sưởi ấm trái tim em.',
      },
    ],
    interactiveActivity: {
      instruction: 'Nụ hôn trên bàn tay mang lại cho bạn nhỏ cảm giác gì?',
      prompt: 'Cảm xúc của bạn nhỏ:',
      items: [
        { text: 'Cảm thấy luôn có mẹ ở bên cạnh động viên, che chở', isCorrect: true, hint: 'Đúng rồi! Tình yêu của mẹ tiếp thêm sức mạnh cho bé.' },
        { text: 'Cảm thấy tự tin, vui vẻ khi bước vào lớp học', isCorrect: true, hint: 'Chính xác! Bé không còn sợ hãi hay bỡ ngỡ.' },
        { text: 'Cảm thấy lo sợ xa mẹ', isCorrect: false, hint: 'Nụ hôn giúp xua tan mọi nỗi sợ xa mẹ con nhé.' },
      ],
    },
    recommendedGameId: 31,
    recommendedGameTitle: 'Đọc hiểu bài thơ Nụ hôn trên bàn tay',
    practiceQuestions: [
      {
        id: 8601,
        instruction: 'Mẹ đã làm gì để bạn nhỏ cảm thấy yên tâm khi đi học?',
        questionContent: 'Hành động ấm áp của người mẹ:',
        options: ['Mua thật nhiều kẹo bánh', 'Đặt một nụ hôn yêu thương vào lòng bàn tay con', 'Cho con nghỉ học ở nhà', 'Mua đồ chơi đắt tiền'],
        correctIndex: 1,
        explanation: 'Mẹ đặt nụ hôn yêu thương vào lòng bàn tay để bé luôn cảm thấy hơi ấm của mẹ chở che.',
      },
    ],
  },
  // CHỦ ĐIỂM 3: MÁI TRƯỜNG MẾN YÊU (TUẦN 23 - 24)
  {
    id: 'hk2-chu-diem-3',
    week: 23,
    lessonNumber: 91,
    unitTitle: 'Tuần 23 • Bài 1 (Học kì II)',
    title: 'Tôi đi học',
    subtitle: 'Chủ điểm Mái trường mến yêu: Kỉ niệm ngày tựu trường thiêng liêng rộn rã cờ hoa',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['tựu trường', 'tiếng trống', 'hoa yêu thương'],
    introStory: 'Buổi mai hôm ấy, một buổi mai đầy sương thu và gió lạnh. Mẹ âu yếm nắm tay tôi dẫn đi trên con đường làng dài và hẹp. Con đường này tôi đã quen đi lại lắm lần, nhưng lần này tự nhiên thấy lạ!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'con đường làng', meaning: 'Con đường quê gắn bó tuổi thơ', audioText: 'con đường làng' },
      { word: 'tiếng trống trường', meaning: 'Tiếng trống giục giã giờ vào lớp tùng tùng tùng', audioText: 'tiếng trống trường' },
      { word: 'bỡ ngỡ', meaning: 'Cảm xúc mới lạ, e ấp lúc ban đầu', audioText: 'bỡ ngỡ' },
      { word: 'khai giảng', meaning: 'Ngày hội tựu trường toàn quốc rực rỡ', audioText: 'khai giảng' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc sâu lắng',
        mouthShape: 'Giọng đọc tha thiết, ngắt nhịp câu đúng chỗ theo văn phong của nhà văn Thanh Tịnh.',
        speechText: 'Hằng năm cứ vào cuối thu, lòng tôi lại nao nức những kỉ niệm mơn man của buổi tựu trường.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những hình ảnh gắn liền với mái trường thân yêu:',
      prompt: 'Hình ảnh đẹp ở trường em:',
      items: [
        { text: 'Bác trống trường tròn xoe giục giã giờ ra chơi', isCorrect: true, hint: 'Đúng rồi! Tùng tùng tùng báo hiệu giờ chơi.' },
        { text: 'Cây bàng xòe tán lá xanh mát rợp góc sân', isCorrect: true, hint: 'Chính xác! Tán lá che bóng mát cho học sinh.' },
        { text: 'Bảng đen phấn trắng và lời cô giáo dịu hiền', isCorrect: true, hint: 'Tuyệt vời! Hình ảnh lớp học thân thương.' },
        { text: 'Khói bụi ồn ào ngoài xa lộ', isCorrect: false, hint: 'Mái trường luôn thanh bình, không có khói bụi xa lộ.' },
      ],
    },
    recommendedGameId: 24,
    recommendedGameTitle: 'Nối từ với tranh Mái trường mến yêu',
    practiceQuestions: [
      {
        id: 9101,
        instruction: 'Tác giả miêu tả cảm xúc ngày đầu đi học như thế nào?',
        questionContent: 'Cảm giác của bạn nhỏ trong bài Tôi đi học:',
        options: ['Chán nản muốn về nhà', 'Bỡ ngỡ, rụt rè nhưng tràn ngập niềm vui thiêng liêng', 'Sợ hãi trốn chạy', 'Không nhớ gì cả'],
        correctIndex: 1,
        explanation: 'Ngày đầu tiên đến trường luôn để lại ấn tượng bỡ ngỡ, trong sáng và khó phai suốt cuộc đời.',
      },
    ],
  },
  // CHỦ ĐIỂM 4: ĐIỀU EM CẦN BIẾT (TUẦN 25 - 26)
  {
    id: 'hk2-chu-diem-4',
    week: 25,
    lessonNumber: 97,
    unitTitle: 'Tuần 25 • Bài 1 (Học kì II)',
    title: 'Rửa tay trước khi ăn & Kĩ năng an toàn',
    subtitle: 'Chủ điểm Điều em cần biết: Thói quen vệ sinh phòng dịch và các kĩ năng sống cần thiết cho học sinh lớp 1',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['vệ sinh', 'kĩ năng', 'an toàn', 'đèn giao thông'],
    introStory: 'Đôi bàn tay hàng ngày cầm bút, nhặt lá, chơi đồ chơi có thể bám nhiều vi khuẩn mắt thường không nhìn thấy. Bạn hãy nhớ rửa tay bằng xà phòng trước khi ăn và sau khi đi vệ sinh nhé!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'rửa tay', meaning: 'Vệ sinh tay sạch sẽ bằng xà phòng và nước sạch', audioText: 'rửa tay' },
      { word: 'xà phòng', meaning: 'Bánh xà phòng diệt vi khuẩn gây bệnh', audioText: 'xà phòng' },
      { word: 'đèn giao thông', meaning: 'Đèn đỏ dừng lại, đèn xanh được đi, đèn vàng đi chậm', audioText: 'đèn giao thông' },
      { word: 'an toàn', meaning: 'Bảo vệ bản thân tránh khỏi tai nạn, nguy hiểm', audioText: 'an toàn' },
    ],
    pronunciationNotes: [
      {
        sound: 'Hướng dẫn kĩ năng',
        mouthShape: 'Đọc dõng dạc, rành mạch từng bước hướng dẫn cụ thể.',
        speechText: 'Rửa tay bằng xà phòng giúp đôi bàn tay sạch sẽ, xua tan vi khuẩn gây bệnh.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy sắp xếp các quy tắc đèn tín hiệu giao thông đường bộ:',
      prompt: 'Ý nghĩa đèn tín hiệu giao thông:',
      items: [
        { text: 'Đèn đỏ: Dừng lại trước vạch quy định', isCorrect: true, hint: 'Chính xác! Đèn đỏ tuyệt đối không được đi tiếp.' },
        { text: 'Đèn xanh: Được phép di chuyển an toàn', isCorrect: true, hint: 'Đúng rồi! Đèn xanh cho phép qua đường.' },
        { text: 'Đèn vàng: Đi chậm lại chuẩn bị dừng lại', isCorrect: true, hint: 'Tuyệt vời! Quan sát cẩn thận khi thấy đèn vàng.' },
        { text: 'Đèn đỏ: Vội vã chạy thật nhanh qua đường', isCorrect: false, hint: 'Cực kì nguy hiểm! Vượt đèn đỏ dễ gây tai nạn giao thông.' },
      ],
    },
    recommendedGameId: 27,
    recommendedGameTitle: 'Tìm từ cùng chủ đề Kĩ năng an toàn cuộc sống',
    practiceQuestions: [
      {
        id: 9701,
        instruction: 'Em cần rửa tay bằng xà phòng vào những thời điểm nào?',
        questionContent: 'Khi nào cần rửa tay sạch sẽ?',
        options: ['Chỉ khi nào tay dính mực', 'Trước khi ăn cơm, sau khi đi vệ sinh và sau khi chơi ngoài sân', 'Không cần rửa tay', 'Một tuần một lần'],
        correctIndex: 1,
        explanation: 'Rửa tay trước khi ăn cơm và sau khi đi vệ sinh là thói quen vệ sinh bắt buộc để bảo vệ sức khỏe.',
      },
    ],
  },
  // CHỦ ĐIỂM 5: BÀI HỌC TỪ CUỘC SỐNG (TUẦN 27 - 28)
  {
    id: 'hk2-chu-diem-5',
    week: 27,
    lessonNumber: 102,
    unitTitle: 'Tuần 27 • Bài 1 (Học kì II)',
    title: 'Kiến và chim bồ câu',
    subtitle: 'Chủ điểm Bài học từ cuộc sống: Lòng biết ơn và sự đền đáp ân nghĩa giữa muôn loài',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['lòng biết ơn', 'cứu giúp', 'ân nghĩa'],
    introStory: 'Kiến rơi xuống dòng suối chảy xiết suýt chết đuối, Bồ Câu nhanh trí thả chiếc lá xuống cứu kiến. Hôm sau, thấy bác thợ săn giương súng nhắm bồ câu, kiến đã cắn mạnh vào chân bác thợ săn để cứu ân nhân!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'chim bồ câu', meaning: 'Sứ giả của hòa bình hiền hòa', audioText: 'chim bồ câu' },
      { word: 'chiếc lá', meaning: 'Lá cây làm bè cứu sống chú kiến', audioText: 'chiếc lá' },
      { word: 'biết ơn', meaning: 'Ghi nhớ công lao cứu mạng của người khác', audioText: 'biết ơn' },
      { word: 'đền đáp', meaning: 'Giúp đỡ lại ân nhân khi họ gặp nạn', audioText: 'đền đáp' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc bài học',
        mouthShape: 'Đọc diễn cảm, giọng ấm áp ca ngợi tình nghĩa thủy chung đền ơn đáp nghĩa.',
        speechText: 'Một hành động tốt sẽ luôn nhận lại sự yêu thương và giúp đỡ quý báu.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những hành động đền ơn đáp nghĩa trong câu chuyện:',
      prompt: 'Hành động đẹp của Kiến và Bồ câu:',
      items: [
        { text: 'Bồ câu thả chiếc lá xuống suối cứu kiến khỏi chết đuối', isCorrect: true, hint: 'Đúng rồi! Cứu mạng chú kiến nhỏ.' },
        { text: 'Kiến cắn vào chân bác thợ săn làm súng bắn trượt cứu bồ câu', isCorrect: true, hint: 'Chính xác! Kiến nhanh trí đền ơn ân nhân.' },
        { text: 'Kiến bỏ mặc bồ câu bay đi', isCorrect: false, hint: 'Kiến không bao giờ vô ơn con nhé!' },
      ],
    },
    recommendedGameId: 31,
    recommendedGameTitle: 'Đọc hiểu chuyện ngụ ngôn Kiến và chim bồ câu',
    practiceQuestions: [
      {
        id: 10201,
        instruction: 'Câu chuyện Kiến và chim bồ câu khuyên chúng ta điều gì?',
        questionContent: 'Ý nghĩa đạo đức của bài học:',
        options: ['Không nên giúp người khác', 'Ở hiền gặp lành, khi được người khác giúp đỡ phải luôn ghi nhớ và tìm cách đền đáp', 'Chỉ nghĩ cho bản thân', 'Không chơi với chim'],
        correctIndex: 1,
        explanation: 'Truyền thống "Ăn quả nhớ kẻ trồng cây", luôn biết ơn và giúp đỡ lại người đã cưu mang mình.',
      },
    ],
  },
  // CHỦ ĐIỂM 6: THIÊN NHIÊN KÌ THÚ (TUẦN 29 - 30)
  {
    id: 'hk2-chu-diem-6',
    week: 29,
    lessonNumber: 107,
    unitTitle: 'Tuần 29 • Bài 1 (Học kì II)',
    title: 'Bảy sắc cầu vồng & Loài chim của biển cả',
    subtitle: 'Chủ điểm Thiên nhiên kì thú: Vẻ đẹp diệu kì của thiên nhiên quanh ta và khám phá đại dương bao la',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['cầu vồng', 'hải âu', 'biển cả', 'kì thú'],
    introStory: 'Sau cơn mưa rào nắng bừng lên, một chiếc cầu vồng lung linh bảy sắc màu bắc ngang bầu trời: đỏ, cam, vàng, lục, lam, chàm, tím. Phía xa ngoài biển khơi, cánh chim Hải Âu sải rộng bay lượn trên ngọn sóng biếc!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'cầu vồng', meaning: 'Dải sáng bảy màu rực rỡ sau cơn mưa', audioText: 'cầu vồng' },
      { word: 'hải âu', meaning: 'Loài chim biểu tượng của biển cả dũng cảm', audioText: 'hải âu' },
      { word: 'sóng biển', meaning: 'Từng đợt sóng vỗ bờ cát trắng', audioText: 'sóng biển' },
      { word: 'kì thú', meaning: 'Đẹp đẽ và kì diệu lạ thường', audioText: 'kì thú' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc tự hào',
        mouthShape: 'Giọng đọc bay bổng, ngân vang ngợi ca vẻ đẹp hùng vĩ của thiên nhiên đất trời.',
        speechText: 'Cầu vồng bảy sắc lung linh, chim hải âu chao lượn trên biển biếc bao la.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn đúng 7 sắc màu của chiếc cầu vồng sau cơn mưa:',
      prompt: 'Các sắc màu cầu vồng:',
      items: [
        { text: 'Đỏ, cam, vàng, lục, lam, chàm, tím', isCorrect: true, hint: 'Chính xác! Bảy dải màu lung linh huyền ảo.' },
        { text: 'Đen, nâu, xám, trắng', isCorrect: false, hint: 'Cầu vồng không có màu đen hay xám xịt con nhé.' },
        { text: 'Hiện ra sau cơn mưa rào khi ánh mặt trời chiếu sáng', isCorrect: true, hint: 'Đúng rồi! Hiện tượng khúc xạ ánh sáng tự nhiên.' },
      ],
    },
    recommendedGameId: 28,
    recommendedGameTitle: 'Nông trại từ ngữ Thiên nhiên kì thú',
    practiceQuestions: [
      {
        id: 10701,
        instruction: 'Loài chim nào được mệnh danh là bạn thân của những người thủy thủ đi biển?',
        questionContent: 'Loài chim của biển cả là chim gì?',
        options: ['Chim sẻ', 'Chim hải âu', 'Chim bồ câu', 'Chim gõ kiến'],
        correctIndex: 1,
        explanation: 'Chim hải âu luôn bay cùng các con tàu ra khơi xa, báo hiệu bờ bến và thời tiết biển.',
      },
    ],
  },
  // CHỦ ĐIỂM 7: THẾ GIỚI TRONG MẮT EM (TUẦN 31 - 32)
  {
    id: 'hk2-chu-diem-7',
    week: 31,
    lessonNumber: 112,
    unitTitle: 'Tuần 31 • Bài 1 (Học kì II)',
    title: 'Tia nắng đi đâu? & Buổi trưa hè',
    subtitle: 'Chủ điểm Thế giới trong mắt em: Cái nhìn hồn nhiên, trong trẻo và ngộ nghĩnh của tuổi thơ',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['tia nắng', 'trưa hè', 'hồn nhiên', 'trong mắt em'],
    introStory: 'Buổi sáng tia nắng thức dậy đánh thức chú gà trống gáy vang, sưởi ấm giọt sương trên lá cỏ non. Buổi chiều tối mặt trời lặn sau đồi, bé băn khoăn tự hỏi: "Tia nắng đi ngủ ở đâu nhỉ?"',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'tia nắng', meaning: 'Ánh nắng ban mai ấm áp vàng tươi', audioText: 'tia nắng' },
      { word: 'tiếng ve', meaning: 'Tiếng ve râm ran gọi hè trên tán phượng', audioText: 'tiếng ve' },
      { word: 'hoa phượng', meaning: 'Cánh hoa phượng đỏ thắm góc sân trường', audioText: 'hoa phượng' },
      { word: 'giấc mơ', meaning: 'Giấc mơ thần tiên tuổi thơ êm đềm', audioText: 'giấc mơ' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc trong trẻo',
        mouthShape: 'Đọc với giọng hồn nhiên, vui tươi, thể hiện trí tưởng tượng ngộ nghĩnh của bé.',
        speechText: 'Buổi trưa hè tĩnh lặng, tiếng ve râm ran trên vòm lá phượng đỏ rực.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những âm thanh, hình ảnh quen thuộc của một buổi trưa hè:',
      prompt: 'Hình ảnh mùa hè trong mắt em:',
      items: [
        { text: 'Hoa phượng vĩ nở đỏ rực góc sân trường', isCorrect: true, hint: 'Đúng rồi! Hoa phượng báo hiệu mùa hè đến.' },
        { text: 'Tiếng ve sầu kêu râm ran trên các tán cây', isCorrect: true, hint: 'Chính xác! Âm thanh rộn ràng mùa ve kêu.' },
        { text: 'Bông hoa tuyết rơi trắng xóa', isCorrect: false, hint: 'Mùa hè Việt Nam ngập tràn ánh nắng ấm, không có tuyết rơi.' },
        { text: 'Cánh diều giấy bay lượn trên triền đê lộng gió', isCorrect: true, hint: 'Tuyệt vời! Trò chơi thả diều tuổi thơ êm đềm.' },
      ],
    },
    recommendedGameId: 29,
    recommendedGameTitle: 'Đọc thơ chọn tranh: Tia nắng đi đâu',
    practiceQuestions: [
      {
        id: 11201,
        instruction: 'Hình ảnh nào là đặc trưng nhất báo hiệu mùa hè sang của lứa tuổi học trò?',
        questionContent: 'Dấu hiệu của mùa hè học trò:',
        options: ['Hoa đào nở rộ đón Tết', 'Hoa phượng đỏ thắm và tiếng ve ngân vang', 'Lá vàng rụng đầy sân', 'Gió bấc lạnh giá'],
        correctIndex: 1,
        explanation: 'Hoa phượng đỏ rực và tiếng ve sầu râm ran là biểu tượng thiêng liêng báo hiệu mùa hè và bế giảng năm học.',
      },
    ],
  },
  // CHỦ ĐIỂM 8: ĐẤT NƯỚC VÀ CON NGƯỜI (TUẦN 33 - 34) & ÔN TẬP CUỐI NĂM (TUẦN 35)
  {
    id: 'hk2-chu-diem-8',
    week: 33,
    lessonNumber: 117,
    unitTitle: 'Tuần 33 • Bài 1 (Học kì II)',
    title: 'Cậu bé thông minh & Ruộng bậc thang ở Sa Pa',
    subtitle: 'Chủ điểm Đất nước và con người: Ca ngợi trí tuệ dân gian Việt Nam và vẻ đẹp kì vĩ của danh lam thắng cảnh Tổ quốc',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 2)',
    letters: ['Việt Nam', 'Tổ quốc', 'Sa Pa', 'thông minh'],
    introStory: 'Đất nước Việt Nam cong hình chữ S tươi đẹp, có ruộng bậc thang Sa Pa uốn lượn như những dải lụa vàng giữa mây trời, có biển xanh cát trắng và những người dân thông minh, dũng cảm, nhân ái!',
    introImageKey: 'reading-garden',
    sampleWords: [
      { word: 'ruộng bậc thang', meaning: 'Kiệt tác ruộng cấy lúa trên sườn núi non cao', audioText: 'ruộng bậc thang' },
      { word: 'Việt Nam', meaning: 'Tổ quốc thân yêu muôn đời của chúng ta', audioText: 'Việt Nam' },
      { word: 'cậu bé thông minh', meaning: 'Nhân vật cổ tích mưu trí giúp dân, giúp nước', audioText: 'cậu bé thông minh' },
      { word: 'lính cứu hỏa', meaning: 'Những chiến sĩ dũng cảm bảo vệ bình yên cho nhân dân', audioText: 'lính cứu hỏa' },
    ],
    pronunciationNotes: [
      {
        sound: 'Đọc trang trọng',
        mouthShape: 'Đọc to, rõ, dõng dạc, thể hiện tình yêu quê hương đất nước nồng nàn.',
        speechText: 'Việt Nam đất nước ta ơi! Mênh mông biển lúa đâu trời đẹp hơn.',
      },
    ],
    interactiveActivity: {
      instruction: 'Hãy chọn những danh lam thắng cảnh nổi tiếng của đất nước Việt Nam:',
      prompt: 'Thắng cảnh quê hương Việt Nam:',
      items: [
        { text: 'Ruộng bậc thang vàng óng ở Sa Pa', isCorrect: true, hint: 'Đúng rồi! Kỳ quan canh tác tuyệt đẹp vùng Tây Bắc.' },
        { text: 'Vịnh Hạ Long non nước hữu tình được thế giới vinh danh', isCorrect: true, hint: 'Chính xác! Di sản thiên nhiên thế giới.' },
        { text: 'Thủ đô Hà Nội ngàn năm văn hiến có Hồ Gươm xanh biếc', isCorrect: true, hint: 'Tuyệt vời! Trái tim thân yêu của Tổ quốc.' },
        { text: 'Kim tự tháp sa mạc', isCorrect: false, hint: 'Kim tự tháp ở nước Ai Cập xa xôi con nhé.' },
      ],
    },
    recommendedGameId: 35,
    recommendedGameTitle: 'Đố vui Trạng nguyên: Non sông gấm vóc Việt Nam',
    practiceQuestions: [
      {
        id: 11701,
        instruction: 'Ruộng bậc thang ở Sa Pa được bà con đồng bào vùng cao đắp trên địa hình nào?',
        questionContent: 'Ruộng bậc thang nằm ở đâu?',
        options: ['Dưới lòng sông sâu', 'Trên các sườn núi dốc thoai thoải thành từng bậc', 'Trên nóc nhà cao tầng', 'Giữa bãi cát biển'],
        correctIndex: 1,
        explanation: 'Ruộng bậc thang được khéo léo đắp thành từng bậc trên sườn núi dốc để giữ nước và trồng lúa tươi tốt.',
      },
    ],
  },
  // BÀI TỔNG KẾT VÀ ĐÁNH GIÁ CUỐI NĂM HỌC (TUẦN 35)
  {
    id: 'hk2-tong-ket-nam-hoc',
    week: 35,
    lessonNumber: 120,
    unitTitle: 'Tuần 35 • Tổng kết năm học',
    title: 'Đại tiệc Hoa Sao – Em hoàn thành lớp 1!',
    subtitle: 'Tổng kết toàn bộ 35 tuần học Tiếng Việt lớp 1 – Bộ sách Kết nối tri thức với cuộc sống',
    bookCurriculum: 'Tiếng Việt 1 – Bộ sách Kết nối tri thức với cuộc sống (Tập 1 & Tập 2)',
    letters: ['Hoàn thành', 'Lớp 1', 'Lên lớp 2', 'Tự hào'],
    introStory: 'Ve kêu gọi hè, hoa phượng đỏ rực sân trường! Chúc mừng các em học sinh thân yêu đã xuất sắc hoàn thành trọn vẹn chương trình Tiếng Việt lớp 1 cùng Cô Đào và Ong Vàng! Các em đã đọc thông, viết thạo, biết yêu thương gia đình, thầy cô và bạn bè!',
    introImageKey: 'vietnamese-arena',
    sampleWords: [
      { word: 'hoàn thành', meaning: 'Cán đích xuất sắc cả năm học', audioText: 'hoàn thành' },
      { word: 'chăm ngoan', meaning: 'Học sinh gương mẫu, lễ phép', audioText: 'chăm ngoan' },
      { word: 'lên lớp hai', meaning: 'Vững vàng bước vào năm học mới', audioText: 'lên lớp hai' },
      { word: 'tạm biệt lớp một', meaning: 'Lưu giữ những kỉ niệm đẹp nhất tuổi thơ', audioText: 'tạm biệt lớp một' },
    ],
    pronunciationNotes: [
      {
        sound: 'Lời chúc mừng',
        mouthShape: 'Đọc to, tràn đầy niềm vui, sự tự hào và chúc mừng học sinh.',
        speechText: 'Chúc mừng con đã xuất sắc hoàn thành chương trình Tiếng Việt lớp một! Con xứng đáng là con ngoan trò giỏi!',
      },
    ],
    interactiveActivity: {
      instruction: 'Bé hãy nhìn lại hành trình cả năm học và chọn những thành tích đã đạt được:',
      prompt: 'Thành quả ngọt ngào sau 35 tuần:',
      items: [
        { text: 'Đọc trơn lưu loát các bài thơ, câu chuyện Tiếng Việt', isCorrect: true, hint: 'Tuyệt vời! Con đã biết đọc thông thạo rồi.' },
        { text: 'Phân biệt đúng 29 chữ cái, các âm đầu và vần ghép', isCorrect: true, hint: 'Rất giỏi! Nắm vững toàn bộ bảng chữ cái và vần.' },
        { text: 'Biết viết đúng chính tả c/k, g/gh, ng/ngh', isCorrect: true, hint: 'Chính xác! Thuộc lòng quy tắc vàng chính tả.' },
        { text: 'Thu thập được thật nhiều Ngôi sao vàng và Huy hiệu Ong Vàng', isCorrect: true, hint: 'Xuất sắc! Bảng thành tích rực rỡ hoa sao.' },
      ],
    },
    recommendedGameId: 40,
    recommendedGameTitle: 'Đại tiệc hoa sao Tiếng Việt - Vinh danh Trạng nguyên lớp 1',
    practiceQuestions: [
      {
        id: 12001,
        instruction: 'Sau khi hoàn thành chương trình Tiếng Việt lớp 1, bước sang năm học mới con sẽ bước vào lớp mấy?',
        questionContent: 'Năm học tới con sẽ là học sinh lớp nào?',
        options: ['Lớp Mầm non', 'Lớp 2 (Lớp Hai)', 'Lớp 5', 'Lớp 10'],
        correctIndex: 1,
        explanation: 'Con đã hoàn thành xuất sắc lớp 1 và tự tin bước vào Lớp 2 thân yêu!',
      },
    ],
  },
];
