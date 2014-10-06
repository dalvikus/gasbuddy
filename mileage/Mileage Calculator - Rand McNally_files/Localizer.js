/**
 * @fileoverview String localization dictionary.
 * deCarta confidential and proprietary.
 * Copyright 2006-2009 deCarta. All rights reserved.
 */

/**
 * @class String localizer for use with this application.
 * @param {Locale} locale
 */
deCarta.App.Localizer = {};

/**
 * Our default localization, as defined by a deCarta Locale.
 * @type Locale
 */
//deCarta.App.Localizer.locale = new Locale("@WNW4LOCALELANG@","@WNW4LOCALECOUNTRY@");
deCarta.App.Localizer.locale = null;

/**
 * get internationalized value for a given key
 * @param {String} key
 * @param {Array} bindVariables - optional array of bind variables to substituted into the {N}
 * structures in the code, e.g. "Thank you {0} {1} for you rating of {2}."
 *
 * bindVariables now can also be an object in the form {distance: "2 km", hours: 4, minutes: 12}
 * which can be applied to something in the form of :
 * {distance} - about {hours} hrs {minutes} mins
 *
 */
deCarta.App.Localizer.get = function(key, bindVariables){
    var value = "";


    if (deCarta.App.Localizer.data[key.toString()]){
        if (deCarta.App.Localizer.data[key.toString()][deCarta.App.Localizer.locale.toString()]){
            value = deCarta.App.Localizer.data[key.toString()][deCarta.App.Localizer.locale.toString()];
        } else {
            if (deCarta.App.Localizer.data[key.toString()]['EN_US']){
                value = deCarta.App.Localizer.data[key.toString()]['EN_US'];
            } else {
        //throw new Exception('Localizer exception: key ' + key + ' exists, but no language available');
        }
        }
    } else {
    //throw new Exception('Localizer exception: key '+ key +' not present');
    }
    
    // sub in values preserving local grammar

    if (bindVariables && value) {
        for (var prop in bindVariables){
            if (bindVariables.hasOwnProperty(prop)) {
                value = value.replace("{" + prop + "}", bindVariables[prop]);
            }
        }
    }
    if(value) {
        return value;
    } else {
        return '';
    //throw new Exception("Localizer Exception: " + deCarta.App.Localizer.locale.language + "_" + deCarta.App.Localizer.locale.country + " does not have key: " + key);
    }
}

/**
 * for dynamic Locale switching.
 */
deCarta.App.Localizer.setLocale = function(locale){
    if(!locale.language || !locale.country){
        throw new Exception("valid Locale instance required in setter");
    }
    deCarta.App.Localizer.locale = locale;
}

/**
 * String values. 
 */
deCarta.App.Localizer.data = {

    "txt_ok": {
        EN_US: "Ok",
        IT_IT: "Ok",
        CH_CH: "�?�以",
        ES_ES: ""
    },
    "txt_cancel": {
        EN_US: "Cancel",
        IT_IT: "Annulla",
        CH_CH: "�?�消"
    },
    "your_location":{
        EN_US: "Your Location",
        IT_IT: "La vostra posizione",
        CH_CH: "您的�?置"
    },
    "location_accuracy": {
        EN_US: "Accuracy: {0} meters",
        IT_IT: "Precisione: {0} metri",
        CH_CH: "精度：{0}米"
    },
    "btn_geolocate": {
        EN_US: "Locate",
        IT_IT: "Localizza",
        CH_CH: "定�?"
    },
    "btn_address_search": {
        EN_US: "Addresses",
        IT_IT: "Indirizzi",
        CH_CH: "地�?��?�索"
    },
    "btn_business_search": {
        EN_US: "Businesses",
        IT_IT: "Attività",
        CH_CH: "商业�?�索"
    },
    "btn_category_search": {
        EN_US: "Categories",
        IT_IT: "Categorie",
        CH_CH: "类别�?�索"
    },
    "btn_corridor_search": {
        EN_US: "Search Along Route",
        IT_IT: "Cerca lungo il percorso",
        CH_CH: "沿路径�?�索"
    },
    "btn_options": {
        EN_US: "Options",
        IT_IT: "Opzioni",
        CH_CH: "选项"
    },
    "btn_search_address": {
        EN_US: "Find Address",
        IT_IT: "Trova Indirizzo",
        CH_CH: "地�?��?�索"
    },
    "btn_search_business": {
        EN_US: "Find Business",
        IT_IT: "Trova Attività",
        CH_CH: "商业�?�索"
    },
    "btn_search_category": {
        EN_US: "Find POIs",
        IT_IT: "Trova",
        CH_CH: "类别�?�索"
    },
    "lbl_index_level": {
        EN_US: "Index level",
        IT_IT: "Livello dell'indice",
        CH_CH: "索引级"
    },
    "lbl_number_responses": {
        EN_US: "Number of Results",
        IT_IT: "Numero di Risultati",
        CH_CH: "结果总数"
    },
    "lbl_sort_criteria": {
        EN_US: "Sort Criteria",
        IT_IT: "Ordine dei risultati",
        CH_CH: "排�?标准"
    },
    "lbl_rank_criteria": {
        EN_US: "Rank Criteria",
        IT_IT: "Ranking dei risultati",
        CH_CH: "分级标准"
    },
    "lbl_language": {
        EN_US: "Language",
        IT_IT: "Lingua",
        CH_CH: "语言 : "
    },
    "lbl_theme_select": {
        EN_US: "Select a Theme",
        IT_IT: "Seleziona un tema",
        CH_CH: "选择风格"
    },
    "lbl_opacity_slider": {
        EN_US: "Side panel opacity",
        IT_IT: "Opacita' pannello laterale",
        CH_CH: "�?��?��?�?明性"
    },
    "lbl_map_config": {
        EN_US: "Map config",
        IT_IT: "Configurazione Mappa",
        CH_CH: "地图设置"
    },
    "lbl_map_locale": {
        EN_US: "Geocoding Locale",
        IT_IT: "Localizzazione Geocode",
        CH_CH: "地�?�编�?区域设置"
    },
    "lbl_map_easing": {
        EN_US: "Enable map easing",
        IT_IT: "Movimento d'inerzia",
        CH_CH: "开�?� easing 效果"
    },
    "lbl_map_zoomdblclk": {
        EN_US: "Double click zoom",
        IT_IT: "Zoom su doppio click",
        CH_CH: "�?�击放大"
    },
    "lbl_map_digitalzoom": {
        EN_US: "Digital Zoom",
        IT_IT: "Attiva zoom digitale",
        CH_CH: "数�?缩放"
    },
    "lbl_map_centerdblclk": {
        EN_US: "Double click center",
        IT_IT: "Centra mappa su doppio click",
        CH_CH: "�?�击定�?地图中心"
    },
    "lbl_map_zoomwheel" :{
        EN_US: "Zoom with mouse wheel",
        IT_IT: "Zoom con rotella del mouse",
        CH_CH: "鼠标滚轮缩放"
    },
    "lbl_map_rtclkbbzoom": {
        EN_US: "Rt. click bounding box zoom",
        IT_IT: "Zoom su area selezionata (click destro e trascina)",
        CH_CH: "�?�键选定框放大"
    },
    "lbl_map_fadetiles": {
        EN_US: "Tile fading effects",
        IT_IT: "Effetti di dissolvenza",
        CH_CH: "地图消�?效果"
    },
    "lbl_opt_savestate": {
        EN_US: "Save application state",
        IT_IT: "Salvataggio stato",
        CH_CH: "�?存状�?"
    },
    "lbl_search_onmove": {
        EN_US: "Continuous search",
        IT_IT: "Ricerca continua",
        CH_CH: "连续�?�索"
    },
    "lbl_searchOptionGroup": {
        EN_US: "Search options",
        IT_IT: "Opzioni di ricerca",
        CH_CH: "�?�索设置"
    },
    "lbl_mapOptionGroup": {
        EN_US: "Map options",
        IT_IT: "Opzioni della mappa",
        CH_CH: "地图设置"
    },
    "lbl_uiOptionGroup": {
        EN_US: "UI Options",
        IT_IT: "Opzioni interfaccia",
        CH_CH: "界�?�设置"
    },
    "lbl_distance_from_origin": {
        EN_US: "distance from origin",
        IT_IT: "Distanza dall'origine",
        CH_CH: "TODO: Translate"
    },
    "lbl_distance_from_route": {
        EN_US: "distance from route",
        IT_IT: "Distanza dal percorso",
        CH_CH: "到路径�?离"
    },
    "btn_clear_map": {
        EN_US: "Clear Map",
        IT_IT: "Resetta Mappa",
        CH_CH: "清�?�地图"
    },
    "btn_street_view": {
        EN_US: "Map View",
        IT_IT: "Visuale Stradale",
        CH_CH: "街�?�视图"
    },
    "btn_hybrid_view": {
        EN_US: "Hybrid View",
        IT_IT: "Visuale Mista",
        CH_CH: "混�?�视图"
    },
    "btn_satellite_view": {
        EN_US: "Satellite View",
        IT_IT: "Visuale Satellitare",
        CH_CH: "�?�星视图"
    },
    "lbl_search_panel": {
        EN_US: "Search",
        IT_IT: "Ricerca",
        CH_CH: "�?�索"
    },
    "txt_welcome_title": {
        EN_US: "Welcome to deCarta Local!",
        IT_IT: "Benvenuto a deCarta Local!",
        CH_CH: "欢迎�?�到deCarta社区!"
    },
    "txt_welcome_text": {
        EN_US: "Welcome to deCarta Local!",
        CH_CH: "欢迎�?�到deCarta社区!"
    },
    "txt_welcome_text_address": {
        EN_US: "To search the map for an address, please enter it in the search box above.",
        IT_IT: "Inserisci un indirizzo nel campo di ricerca.",
        CH_CH: "�?�索地�?�请在上�?��?�索�?输入."
    },
    "txt_welcome_text_business": {
        EN_US: "To search the map for nearby businesses, please enter a search term in the search box above or just select a category from the dropdown list.",
        IT_IT: "Inserisci una chiave di ricerca per trovare attività in zona",
        CH_CH: "�?�索附近的商业目标,请在上�?��?�索�?输入."
    },
    "txt_welcome_text_category": {
        EN_US: "Select a category from the dropdown above.",
        IT_IT: "Seleziona una categoria di punti di interesse.",
        CH_CH: "从上�?�的下拉�?��?�选择类别."
    },
    "txt_items_found": {
        EN_US: "Found {0} items",
        IT_IT: "Trovati {0} risultati",
        CH_CH: "�?�到 {0} 个结果"
    },
    "txt_sort_by": {
        EN_US: "Sort by",
        IT_IT: "Ordina per",
        CH_CH: "排�?"
    },
    "lbl_sort_name": {
        EN_US: "Name",
        IT_IT: "Nome",
        CH_CH: "�??字"
    },
    "lbl_sort_distance": {
        EN_US: "Distance",
        IT_IT: "Distanza",
        CH_CH: "�?离"
    },
    "lbl_sort_popularity": {
        EN_US: "Popularity",
        IT_IT: "Popolarità",
        CH_CH: "欢迎度"
    },
    "lbl_sort_score": {
        EN_US: "Score",
        IT_IT: "Punteggio",
        CH_CH: "分数"
    },
    "lbl_index_name": {
        EN_US: "DB Index Name",
        IT_IT: "Nome Indice DB",
        CH_CH: "索引数�?�库�??字"
    },
    "lbl_db_host": {
        EN_US: "Host Name",
        IT_IT: "Nome Host",
        CH_CH: "主机�??"
    },
    "txt_poi_distance": {
        EN_US: "Distance: {0}",
        IT_IT: "Distanza: {0}",
        CH_CH: "�?离: {0}"
    },
    "txt_poi_phone": {
        EN_US: "Ph: {0}",
        IT_IT: "Tel: {0}",
        CH_CH: "电�?: {0}"
    },
    "txt_no_results": {
        EN_US: "No results",
        IT_IT: "Nessun risultato",
        CH_CH: "没有结果"
    },
    "txt_do_you_mean": {
        EN_US: "Did you mean :",
        IT_IT: "Vuoi dire :",
        CH_CH: "你的�?�?是 :"
    },
    "btn_directions_search": {
        EN_US: "Directions",
        IT_IT: "Percorso",
        CH_CH: "路径"
    },
    "lbl_avoid_ferry": {
        EN_US: "Avoid Ferries",
        IT_IT: "Evita Traghetti",
        CH_CH: "�?�开渡轮"
    },
    "lbl_avoid_toll": {
        EN_US: "Avoid Toll Roads",
        IT_IT: "Evita Pedaggi",
        CH_CH: "�?�开收费公路"
    },
    "lbl_avoid_tunnels": {
        EN_US: "Avoid Tunnels",
        IT_IT: "Evita Gallerie",
        CH_CH: "�?�开隧�?�"
    },
    "lbl_avoid_bridges": {
        EN_US: "Avoid Bridges",
        IT_IT: "Evita Ponti",
        CH_CH: "�?�开桥"
    },
    "lbl_meters": {
        EN_US: "M",
        IT_IT: "M",
        CH_CH: "米"
    },
    "lbl_miles": {
        EN_US: "miles",
        IT_IT: "miglia",
        CH_CH: "英里"
    },
    "lbl_kilometers": {
        EN_US: "KM",
        IT_IT: "KM",
        CH_CH: "公里"
    },
    "opt_fastest": {
        EN_US: "Fastest",
        IT_IT: "Più veloce",
        CH_CH: "最快"
    },
    "opt_shortest": {
        EN_US: "Shortest",
        IT_IT: "Più corto",
        CH_CH: "最短"
    },
    "opt_pedestrian": {
        EN_US: "Pedestrian",
        IT_IT: "A Piedi",
        CH_CH: "步行"
    },
    "opt_avoid_freeways": {
        EN_US: "Avoid Freeways",
        IT_IT: "Evita Autostrade",
        CH_CH: "�?�开高速公路"
    },
    "opt_no_freeways": {
        EN_US: "No Freeways",
        IT_IT: "Niente Autostrade",
        CH_CH: "没有高速公路"
    },
    "opt_more_freeways": {
        EN_US: "More Freeways",
        IT_IT: "Preferenza alle Autostrade",
        CH_CH: "更多高速公路"
    },
    "btn_get_directions": {
        EN_US: "Get Directions",
        IT_IT: "Calcola Percorso",
        CH_CH: "寻找路径"
    },
    "tab_directions_instructions": {
        EN_US: "Instructions",
        IT_IT: "Istruzioni",
        CH_CH: "路径指示"
    },
    "tab_directions_search": {
        EN_US: "Search On Route",
        IT_IT: "Ricerca sul percorso",
        CH_CH: "沿路径�?�索"
    },
    "tab_directions_options":{
        EN_US: "Routing Options",
        IT_IT: "Opzioni",
        CH_CH: "寻找路径选项"
    },
    "tab_directions_options":{
		EN_US: "Routing Options",
        IT_IT: "Opzioni",
        CH_CH: "TODO: Translate"
    },
    "txt_driving_to": {
        EN_US: "Driving to: {0}",
        IT_IT: "Indicazioni per : {0}",
        CH_CH: "开车到: {0}"
    },
    "txt_walking_to": {
        EN_US: "Walking to: {0}",
        IT_IT: "Indicazioni pedonali per : {0}",
        CH_CH: "步行到: {0}"
    },
    "distance_time_very_long": {
        EN_US: "{0} - about {1} day, {2} hr and {3} min",
        IT_IT: "{0} - circa {1} giorno, {2} ore e {3} minuti",
        CH_CH: "{0} - 大概 {1} 天, {2} �?时 {3} 分钟"
    },
    "distance_time_long": {
        EN_US: "{0} - about {1} hrs {2} mins",
        IT_IT: "{0} - circa {1} ora e {2} minuti",
        CH_CH: "{0} - 大约 {1} �?时 {2} 分钟"
    },
    "distance_time": {
        EN_US: "{0} - about {1} mins",
        IT_IT: "{0} - circa {1} minuti",
        CH_CH: "{0} - 大约 {1} 分钟"
    },
    "lbl_directions_from": {
        EN_US: "Directions from here",
        IT_IT: "Partenza da qui",
        CH_CH: "从这儿出�?�"
    },
    "lbl_directions_to": {
        EN_US: "Directions to here",
        IT_IT: "Arrivo qui",
        CH_CH: "到这儿"
    },
    "lbl_center_map": {
        EN_US: "Center map",
        IT_IT: "Centra la mappa",
        CH_CH: "地图中心"
    },
    "lbl_add_marker": {
        EN_US: "Add marker",
        IT_IT: "Aggiungi preferito",
        CH_CH: "添加图标"
    },
    "lbl_global_weather": {
        EN_US: "Local Weather Cams",
        IT_IT: "Webcam Meteo",
        CH_CH: "天气"
    },
    "lbl_close_menu": {
        EN_US: "Close menu",
        IT_IT: "Chiudi menu",
        CH_CH: "退出�?��?�"
    },
    "iw_get_directions": {
        EN_US: "Get Directions: ",
        IT_IT: "Indicazioni: ",
        CH_CH: "寻找路径: "
    },
    "iw_directions_to": {
        EN_US: "To Here",
        IT_IT: "Arriva qui",
        CH_CH: "到这儿"
    },
    "iw_directions_from": {
        EN_US: "From Here",
        IT_IT: "Parti da qui",
        CH_CH: "从这儿出�?�"
    },
    "iw_share": {
        EN_US: "Share",
        IT_IT: "Condividi",
        CH_CH: "Share"
    },
    "iw_reviews": {
        EN_US: "User Reviews",
        IT_IT: "Recensioni",
        CH_CH: "用户评价"
    },
    "txt_add_marker_title": {
        EN_US: "Add a Marker",
        IT_IT: "Aggiungi un preferito",
        CH_CH: "添加图标"
    },
    "txt_add_marker_content": {
        EN_US: "Enter a name : ",
        IT_IT: "Inserisci un nome : ",
        CH_CH: "输入�??字 : "
    },
    "txt_copyright": {
        EN_US: "  © deCarta 2011 - All rights reserved. ",
        IT_IT: "  © deCarta 2011 - Tutti i diritti riservati. ",
        CH_CH: "  © deCarta 2011 - 版�?�所有. "
    },
    "opt_cat_none": {
        EN_US: "Please Select",
        IT_IT: "Scegli Categoria",
        CH_CH: "请选择"
    },
    "opt_cat_atm": {
        EN_US: "ATMs",
        IT_IT: "Bancomat",
        CH_CH: "自动�?�款机"
    },
    "opt_cat_attraction": {
        EN_US: "Attractions",
        IT_IT: "Attrazioni",
        CH_CH: "景点"
    },
    "opt_cat_nightlife": {
        EN_US: "Bars &Clubs",
        IT_IT: "Locali",
        CH_CH: "酒�?� & 俱�?部"
    },
    "opt_cat_cinema": {
        EN_US: "Cinemas",
        IT_IT: "Cinema",
        CH_CH: "电影院"
    },
    "opt_cat_coffee": {
        EN_US: "Coffee",
        IT_IT: "Caffé",
        CH_CH: "咖啡"
    },
    "opt_cat_hotels": {
        EN_US: "Hotels",
        IT_IT: "Hotel",
        CH_CH: "酒店"
    },
    "opt_cat_museums": {
        EN_US: "Museums",
        IT_IT: "Musei",
        CH_CH: "�?�物馆"
    },
    "opt_cat_petrol": {
        EN_US: "Gas",
        IT_IT: "Benzinai",
        CH_CH: "加油站"
    },
    "opt_cat_restaurant": {
        EN_US: "Restaurants",
        IT_IT: "Ristoranti",
        CH_CH: "�?馆"
    },
    "opt_cat_shopping": {
        EN_US: "Shopping",
        IT_IT: "Shopping",
        CH_CH: "商场"
    },
    "opt_cat_theater": {
        EN_US: "Theatres",
        IT_IT: "Teatri",
        CH_CH: "剧院"
    },
    "opt_cat_transport": {
        EN_US: "Transportation",
        IT_IT: "Trasporti",
        CH_CH: "交通"
    },
    "opt_cat_other": {
        EN_US: "Other",
        IT_IT: "Altro",
        CH_CH: "其他"
    },
    "opt_corridor_distance": {
        EN_US: "Drive Distance",
        IT_IT: "Distanza",
        CH_CH: "开车�?离"
    },
    "opt_corridor_euclidean": {
        EN_US: "Euclidean Distance",
        IT_IT: "In linea d\'aria",
        CH_CH: "空间�?离"
    },
    "opt_corridor_drivetime": {
        EN_US: "Driving time",
        IT_IT: "Tempo di guida",
        CH_CH: "开车时间"
    },
    "btn_readme" : {
        EN_US: "About this App",
        IT_IT: "Informazioni sul programma",
        CH_CH: "关于这个程�?"
    },
    "opt_vehicle_none" : {
        EN_US: "Any vehicle",
        IT_IT: "Qualunque veicolo",
        CH_CH: "任何车辆"
    },
    "opt_vehicle_car" : {
        EN_US: "Passenger Car",
        IT_IT: "Automobile",
        CH_CH: "轿车"
    },
    "opt_vehicle_4WD" : {
        EN_US: "4 Wheel Drive",
        IT_IT: "Quattro ruote motrici",
        CH_CH: "四轮汽车"
    },
    "opt_vehicle_HOV" : {
        EN_US: "High Occupancy",
        IT_IT: "HOV",
        CH_CH: "多座汽车"
    },
    "opt_vehicle_emergency" : {
        EN_US: "Emergency",
        IT_IT: "Emergenza",
        CH_CH: "紧急情况"
    },
    "opt_vehicle_taxis" : {
        EN_US: "Taxi",
        IT_IT: "Taxi",
        CH_CH: "出租车"
    },
    "opt_vehicle_bus" : {
        EN_US: "Bus",
        IT_IT: "Autobus",
        CH_CH: "公交车"
    },
    "opt_vehicle_deliverytruck" : {
        EN_US: "Delivery Truck",
        IT_IT: "Camion per consegne",
        CH_CH: "货�?�?�车"
    },
    "opt_vehicle_transporttruck" : {
        EN_US: "Transport Truck",
        IT_IT: "Camion da Trasporto",
        CH_CH: "转�?�?�车"
    },
    "opt_vehicle_motorcycle" : {
        EN_US: "Motorcycle",
        IT_IT: "Motocicletta",
        CH_CH: "摩托车"
    },
    "opt_vehicle_pedestrian" : {
        EN_US: "Pedestrian",
        IT_IT: "Pedone",
        CH_CH: "步行"
    },
    "opt_vehicle_none" : {
        EN_US: "Any vehicle",
        IT_IT: "Qualunque veicolo",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_car" : {
        EN_US: "Passenger Car",
        IT_IT: "Automobile",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_4WD" : {
        EN_US: "4 Wheel Drive",
        IT_IT: "Quattro ruote motrici",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_HOV" : {
        EN_US: "High Occupancy",
        IT_IT: "HOV",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_emergency" : {
        EN_US: "Emergency",
        IT_IT: "Emergenza",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_taxis" : {
        EN_US: "Taxi",
        IT_IT: "Taxi",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_bus" : {
        EN_US: "Bus",
        IT_IT: "Autobus",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_deliverytruck" : {
        EN_US: "Delivery Truck",
        IT_IT: "Camion per consegne",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_transporttruck" : {
        EN_US: "Transport Truck",
        IT_IT: "Camion da Trasporto",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_motorcycle" : {
        EN_US: "Motorcycle",
        IT_IT: "Motocicletta",
        CH_CH: "TODO: Translate"
    },
    "opt_vehicle_pedestrian" : {
        EN_US: "Pedestrian",
        IT_IT: "Pedone",
        CH_CH: "TODO: Translate"
    }
}
