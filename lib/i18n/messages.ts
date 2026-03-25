import type { AppLocale } from "./types";

export type { AppLocale } from "./types";

export interface Messages {
  welcomeTagline: string;
  featureNearTitle: string;
  featureNearDesc: string;
  featureMapTitle: string;
  featureMapDesc: string;
  featureArrivalsTitle: string;
  featureArrivalsDesc: string;
  btnAccess: string;
  btnAccessLoading: string;
  welcomeFooter: string;
  languageLabel: string;
  languageHint: string;
  tabMap: string;
  tabSearch: string;
  tabConfig: string;
  brandTagline: string;
  /** Texto corto en la barra lateral desktop (sin tabs inferiores en móvil). */
  sidebarMapHint: string;
  filterSubtes: string;
  filterBus: string;
  filterStops: string;
  filterAlerts: string;
  configTitle: string;
  configLanguage: string;
  configLanguageHint: string;
  areaOutOfService: string;
  alertOutOfArea: string;
  statusDefaultCity: string;
  linesAll: string;
  alertsEmpty: string;
  alertsEmptySub: string;
  alertsSectionTitle: string;
}

export const MESSAGES: Record<AppLocale, Messages> = {
  es: {
    welcomeTagline: "Transporte del AMBA · Buenos Aires",
    featureNearTitle: "Paradas cercanas",
    featureNearDesc: "Colectivos y subtes a tu alrededor",
    featureMapTitle: "Mapa en tiempo real",
    featureMapDesc: "Líneas, estaciones y recorridos del AMBA",
    featureArrivalsTitle: "Próximas llegadas",
    featureArrivalsDesc: "Cuándo llega tu próximo subte",
    btnAccess: "Acceder",
    btnAccessLoading: "Obteniendo ubicación…",
    welcomeFooter: "Gratis · Sin registro · Funciona offline",
    languageLabel: "Idioma",
    languageHint:
      "Solo cambia textos de la interfaz. Nombres de calles, estaciones y datos en vivo no se traducen.",
    tabMap: "Mapa",
    tabSearch: "Buscar",
    tabConfig: "Config",
    brandTagline: "Transporte AMBA",
    sidebarMapHint: "Listas y ajustes: usá los filtros bajo el mapa (Subtes · Bus · Paradas · Config).",
    filterSubtes: "Subtes",
    filterBus: "Bus",
    filterStops: "Paradas",
    filterAlerts: "Alertas",
    configTitle: "Configuración",
    configLanguage: "Idioma de la aplicación",
    configLanguageHint:
      "Cambiar aquí o en la pantalla de inicio. Los datos de mapa y redes mantienen su idioma original.",
    areaOutOfService:
      "Fuera del área de servicio (AMBA). Mostrando Buenos Aires como referencia.",
    alertOutOfArea:
      "Tu ubicación no está dentro del área de servicio (AMBA). Se mostrará Buenos Aires como referencia para consultar paradas y subtes.",
    statusDefaultCity: "Buenos Aires",
    linesAll: "Todas las líneas",
    alertsEmpty: "Sin alertas activas",
    alertsEmptySub: "El servicio de subtes funciona con normalidad",
    alertsSectionTitle: "Alertas de servicio",
  },

  en: {
    welcomeTagline: "AMBA transport · Buenos Aires",
    featureNearTitle: "Nearby stops",
    featureNearDesc: "Buses and subte around you",
    featureMapTitle: "Live map",
    featureMapDesc: "Lines, stations and AMBA routes",
    featureArrivalsTitle: "Next arrivals",
    featureArrivalsDesc: "When your next subte arrives",
    btnAccess: "Continue",
    btnAccessLoading: "Getting location…",
    welcomeFooter: "Free · No sign-up · Works offline",
    languageLabel: "Language",
    languageHint:
      "Only UI labels change. Street names, stations and live data stay in their original language.",
    tabMap: "Map",
    tabSearch: "Search",
    tabConfig: "Settings",
    brandTagline: "AMBA transport",
    sidebarMapHint: "Lists and settings: use the chips under the map (Subte · Bus · Stops · Settings).",
    filterSubtes: "Subte",
    filterBus: "Bus",
    filterStops: "Stops",
    filterAlerts: "Alerts",
    configTitle: "Settings",
    configLanguage: "App language",
    configLanguageHint:
      "Change here or on the welcome screen. Map and feed data keep their original language.",
    areaOutOfService:
      "Outside the service area (AMBA). Showing Buenos Aires as reference.",
    alertOutOfArea:
      "Your location is outside the service area (AMBA). Buenos Aires will be shown as reference for stops and subte.",
    statusDefaultCity: "Buenos Aires",
    linesAll: "All lines",
    alertsEmpty: "No active alerts",
    alertsEmptySub: "Subte service is running normally",
    alertsSectionTitle: "Service alerts",
  },

  "pt-BR": {
    welcomeTagline: "Transporte AMBA · Buenos Aires",
    featureNearTitle: "Paradas próximas",
    featureNearDesc: "Ônibus e subte ao seu redor",
    featureMapTitle: "Mapa en vivo",
    featureMapDesc: "Linhas, estações e rotas do AMBA",
    featureArrivalsTitle: "Próximas chegadas",
    featureArrivalsDesc: "Quando chega seu próximo subte",
    btnAccess: "Entrar",
    btnAccessLoading: "Obtendo localização…",
    welcomeFooter: "Grátis · Sem cadastro · Funciona offline",
    languageLabel: "Idioma",
    languageHint:
      "Altera apenas textos da interface. Ruas, estações e dados ao vivo não são traduzidos.",
    tabMap: "Mapa",
    tabSearch: "Buscar",
    tabConfig: "Config",
    brandTagline: "Transporte AMBA",
    sidebarMapHint: "Listas e ajustes: use os filtros abaixo do mapa (Subte · Ônibus · Paradas · Config).",
    filterSubtes: "Subte",
    filterBus: "Ônibus",
    filterStops: "Paradas",
    filterAlerts: "Alertas",
    configTitle: "Configurações",
    configLanguage: "Idioma do app",
    configLanguageHint:
      "Altere aqui ou na tela inicial. Dados do mapa permanecem no idioma original.",
    areaOutOfService:
      "Fora da área de serviço (AMBA). Mostrando Buenos Aires como referência.",
    alertOutOfArea:
      "Sua localização está fora da área de serviço (AMBA). Buenos Aires será mostrada como referência para paradas e subte.",
    statusDefaultCity: "Buenos Aires",
    linesAll: "Todas as linhas",
    alertsEmpty: "Sem alertas ativos",
    alertsEmptySub: "O serviço de subte opera normalmente",
    alertsSectionTitle: "Alertas de serviço",
  },

  pl: {
    welcomeTagline: "Transport AMBA · Buenos Aires",
    featureNearTitle: "Przystanki w pobliżu",
    featureNearDesc: "Autobusy i subte w pobliżu",
    featureMapTitle: "Mapa na żywo",
    featureMapDesc: "Linie, stacje i trasy AMBA",
    featureArrivalsTitle: "Najbliższe przyjazdy",
    featureArrivalsDesc: "Kiedy przyjedzie następny subte",
    btnAccess: "Wejdź",
    btnAccessLoading: "Pobieranie lokalizacji…",
    welcomeFooter: "Za darmo · Bez rejestracji · Działa offline",
    languageLabel: "Język",
    languageHint:
      "Zmienia tylko etykiety interfejsu. Nazwy ulic, stacji i dane na żywo pozostają w oryginale.",
    tabMap: "Mapa",
    tabSearch: "Szukaj",
    tabConfig: "Ustawienia",
    brandTagline: "Transport AMBA",
    sidebarMapHint: "Listy i ustawienia: przyciski pod mapą (Subte · Autobus · Przystanki · Ustawienia).",
    filterSubtes: "Subte",
    filterBus: "Autobus",
    filterStops: "Przystanki",
    filterAlerts: "Alerty",
    configTitle: "Ustawienia",
    configLanguage: "Język aplikacji",
    configLanguageHint:
      "Zmień tutaj lub na ekranie powitalnym. Dane mapy zachowują język źródłowy.",
    areaOutOfService:
      "Poza obszarem usług (AMBA). Pokazujemy Buenos Aires jako odniesienie.",
    alertOutOfArea:
      "Twoja lokalizacja jest poza obszarem usług (AMBA). Buenos Aires zostanie pokazane jako odniesienie dla przystanków i subte.",
    statusDefaultCity: "Buenos Aires",
    linesAll: "Wszystkie linie",
    alertsEmpty: "Brak aktywnych alertów",
    alertsEmptySub: "Serwis subte działa prawidłowo",
    alertsSectionTitle: "Alerty eksploatacyjne",
  },

  "en-US": {
    welcomeTagline: "AMBA transit · Buenos Aires",
    featureNearTitle: "Nearby stops",
    featureNearDesc: "Buses and subte around you",
    featureMapTitle: "Live map",
    featureMapDesc: "Lines, stations and AMBA routes",
    featureArrivalsTitle: "Next arrivals",
    featureArrivalsDesc: "When your next subte arrives",
    btnAccess: "Get started",
    btnAccessLoading: "Getting location…",
    welcomeFooter: "Free · No sign-up · Works offline",
    languageLabel: "Language",
    languageHint:
      "Only UI labels change. Street names, stations and live data stay in their original language.",
    tabMap: "Map",
    tabSearch: "Search",
    tabConfig: "Settings",
    brandTagline: "AMBA transit",
    sidebarMapHint: "Lists and settings: use the chips under the map (Subte · Bus · Stops · Settings).",
    filterSubtes: "Subte",
    filterBus: "Bus",
    filterStops: "Stops",
    filterAlerts: "Alerts",
    configTitle: "Settings",
    configLanguage: "App language",
    configLanguageHint:
      "Change here or on the welcome screen. Map and feed data keep their original language.",
    areaOutOfService:
      "Outside the service area (AMBA). Showing Buenos Aires as reference.",
    alertOutOfArea:
      "Your location is outside the service area (AMBA). Buenos Aires will be shown as reference for stops and subte.",
    statusDefaultCity: "Buenos Aires",
    linesAll: "All lines",
    alertsEmpty: "No active alerts",
    alertsEmptySub: "Subte service is running normally",
    alertsSectionTitle: "Service alerts",
  },

  ja: {
    welcomeTagline: "AMBA交通 · ブエノスアイレス",
    featureNearTitle: "近くの停留所",
    featureNearDesc: "周辺のバスとサブテ（地下鉄）",
    featureMapTitle: "リアルタイム地図",
    featureMapDesc: "路線・駅・AMBAの経路",
    featureArrivalsTitle: "次の到着",
    featureArrivalsDesc: "次のサブテの到着まで",
    btnAccess: "開始",
    btnAccessLoading: "位置情報を取得中…",
    welcomeFooter: "無料 · 登録不要 · オフライン対応",
    languageLabel: "言語",
    languageHint:
      "UIの表記のみ変更されます。道路名・駅名・ライブデータはそのままです。",
    tabMap: "地図",
    tabSearch: "検索",
    tabConfig: "設定",
    brandTagline: "AMBA交通",
    sidebarMapHint: "一覧と設定は、地図下のチップから（サブテ・バス・停留所・設定）。",
    filterSubtes: "サブテ",
    filterBus: "バス",
    filterStops: "停留所",
    filterAlerts: "アラート",
    configTitle: "設定",
    configLanguage: "アプリの言語",
    configLanguageHint:
      "ここまたはウェルカム画面で変更できます。地図データは元の言語のままです。",
    areaOutOfService:
      "サービスエリア（AMBA）外です。参照としてブエノスアイレスを表示します。",
    alertOutOfArea:
      "お位置がサービスエリア（AMBA）外です。停留所・サブテの参照としてブエノスアイレスを表示します。",
    statusDefaultCity: "ブエノスアイレス",
    linesAll: "全路線",
    alertsEmpty: "有効なアラートはありません",
    alertsEmptySub: "サブテは正常に運行しています",
    alertsSectionTitle: "運行情報",
  },

  zh: {
    welcomeTagline: "AMBA 交通 · 布宜诺斯艾利斯",
    featureNearTitle: "附近站点",
    featureNearDesc: "周边的公交与地铁（Subte）",
    featureMapTitle: "实时地图",
    featureMapDesc: "线路、车站与 AMBA 路线",
    featureArrivalsTitle: "即将到站",
    featureArrivalsDesc: "下一班 Subte 何时到达",
    btnAccess: "进入",
    btnAccessLoading: "正在获取位置…",
    welcomeFooter: "免费 · 无需注册 · 支持离线",
    languageLabel: "语言",
    languageHint:
      "仅更改界面文字。街道名、车站名与实时数据不翻译。",
    tabMap: "地图",
    tabSearch: "搜索",
    tabConfig: "设置",
    brandTagline: "AMBA 交通",
    sidebarMapHint: "列表与设置：使用地图下方的选项（地铁 · 公交 · 站点 · 设置）。",
    filterSubtes: "地铁",
    filterBus: "公交",
    filterStops: "站点",
    filterAlerts: "提醒",
    configTitle: "设置",
    configLanguage: "应用语言",
    configLanguageHint:
      "可在此或欢迎页更改。地图数据保持原始语言。",
    areaOutOfService:
      "不在服务区域（AMBA）内。以布宜诺斯艾利斯为参考显示。",
    alertOutOfArea:
      "您的位置不在服务区域（AMBA）内。将以布宜诺斯艾利斯为参考查询站点与 Subte。",
    statusDefaultCity: "布宜诺斯艾利斯",
    linesAll: "全部线路",
    alertsEmpty: "暂无活跃提醒",
    alertsEmptySub: "地铁服务运行正常",
    alertsSectionTitle: "运营提醒",
  },
};

export type MessageKey = keyof Messages;
