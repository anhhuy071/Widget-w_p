import useProfileStore from "../stores/profileStore";

export const translations = {
  vi: {
    // Navigation
    home: "Trang chủ",
    news: "Tin tức",
    settings: "Cài đặt",
    live: "Trực tiếp",
    online: "Trực tuyến",
    
    // Time & Greetings
    greetingLabel: "Lời chào",
    localTime: "Giờ địa phương",
    dateLabel: "Ngày tháng",
    goodMorning: "Chào buổi sáng",
    goodAfternoon: "Chào buổi chiều",
    goodEvening: "Chào buổi tối",
    goodNight: "Chúc ngủ ngon",
    morningFlow: "Dòng chảy buổi sáng",
    afternoonSession: "Phiên làm việc chiều",
    eveningWinddown: "Thư giãn buổi tối",
    nightMode: "Chế độ ban đêm",
    
    // Todos
    todoTitle: "Danh sách công việc",
    dailyFocus: "Tiêu điểm hôm nay",
    todoPlaceholder: "Nhập công việc tiếp theo...",
    addButton: "Thêm",
    noTodos: "Chưa có công việc nào! Hãy thêm một công việc để bắt đầu.",
    
    // Weather
    weatherForecast: "Dự báo thời tiết",
    feelsLike: "Cảm giác như",
    humidity: "Độ ẩm",
    wind: "Gió",
    unableLoadWeather: "Không thể tải dự báo thời tiết",
    weatherConfigError: "Kiểm tra xem máy chủ đã được cấu hình khóa API thời tiết hay chưa và xác minh thành phố trong Cài đặt.",
    retry: "Thử lại",
    refresh: "Làm mới",
    
    // Pomodoro
    focus: "Tập trung",
    shortBreak: "Nghỉ ngắn",
    longBreak: "Nghỉ dài",
    start: "Bắt đầu",
    pause: "Tạm dừng",
    reset: "Đặt lại",
    skip: "Bỏ qua",
    todaysSessions: "Số lượt hoàn thành hôm nay",
    
    // News
    featuredNews: "Tin tức nổi bật",
    latestUpdate: "Cập nhật mới nhất",
    all: "Tất cả",
    readNews: "Đọc tin",
    noNews: "Không có tin tức nào trong danh mục này.",
    
    // Settings
    profileSettings: "Cài đặt Hồ sơ",
    nameLabel: "Tên",
    cityLabel: "Thành phố",
    interestsLabel: "Sở thích tin tức",
    timerSettings: "Cài đặt Hẹn giờ",
    workDuration: "Thời gian tập trung (phút)",
    shortBreakDuration: "Thời gian nghỉ ngắn (phút)",
    longBreakDuration: "Thời gian nghỉ dài (phút)",
    saveButton: "Lưu cài đặt",
    settingsSaved: "Lưu cài đặt thành công!",
    languageLabel: "Ngôn ngữ",
    
    // Categories
    thoisu: "Thời sự",
    thegioi: "Thế giới",
    thethao: "Thể thao",
    giaitri: "Giải trí",
    suckhoe: "Sức khỏe",
    
    // Startup
    startupTitle: "Chào mừng! Thiết lập tài khoản",
    startupSubtitle: "Chúng tôi chỉ cần vài thông tin để cá nhân hóa bảng điều khiển.",
    startupCityPlaceholder: "Chọn tỉnh hoặc thành phố tại Việt Nam",
    startupSave: "Lưu & Tiếp tục",
    themeLabel: "Giao diện",
    light: "Sáng",
    dark: "Tối",
    system: "Hệ thống",
  },
  en: {
    // Navigation
    home: "Home",
    news: "News",
    settings: "Settings",
    live: "Live",
    online: "Online",
    
    // Time & Greetings
    greetingLabel: "Greeting",
    localTime: "Local Time",
    dateLabel: "Date",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    goodNight: "Good Night",
    morningFlow: "Morning Flow",
    afternoonSession: "Afternoon Session",
    eveningWinddown: "Evening Wind-down",
    nightMode: "Night Mode",
    
    // Todos
    todoTitle: "Todo List",
    dailyFocus: "Daily focus",
    todoPlaceholder: "Write your next task...",
    addButton: "Add",
    noTodos: "No tasks yet! Add one above to get started.",
    
    // Weather
    weatherForecast: "Local forecast",
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    unableLoadWeather: "Unable to load forecast",
    weatherConfigError: "Check that the server has a weather API key configured and verify your city in Settings.",
    retry: "Retry",
    refresh: "Refresh",
    
    // Pomodoro
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    skip: "Skip",
    todaysSessions: "Completed sessions today",
    
    // News
    featuredNews: "Featured News",
    latestUpdate: "Latest update",
    all: "All",
    readNews: "Read news",
    noNews: "No news in this category.",
    
    // Settings
    profileSettings: "Profile Settings",
    nameLabel: "Name",
    cityLabel: "City",
    interestsLabel: "News Interests",
    timerSettings: "Timer Settings",
    workDuration: "Work Duration (mins)",
    shortBreakDuration: "Short Break Duration (mins)",
    longBreakDuration: "Long Break Duration (mins)",
    saveButton: "Save Settings",
    settingsSaved: "Settings saved successfully!",
    languageLabel: "Language",
    
    // Categories
    thoisu: "News",
    thegioi: "World",
    thethao: "Sports",
    giaitri: "Entertainment",
    suckhoe: "Health",
    
    // Startup
    startupTitle: "Welcome! Let's set you up",
    startupSubtitle: "We only need a few details to personalize your dashboard.",
    startupCityPlaceholder: "Select a city or province in Vietnam",
    startupSave: "Save & Continue",
    themeLabel: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
};

export const useTranslation = () => {
  const language = useProfileStore((state) => state.language) || "vi";
  
  const t = (key: keyof typeof translations.vi): string => {
    return translations[language][key] || translations.vi[key];
  };
  
  return { t, language };
};
