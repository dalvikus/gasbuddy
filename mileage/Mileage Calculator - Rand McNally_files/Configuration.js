console.log( "--> Configuration.js: ..." );

APP_NAME = "randmcnally-maps";

randmcnallyAppConfiguration = {

    buttonbar: {

        quicksearch:		true,
        hotel:				true,
        restaurant:			true,
        shopping:			false,
        nightlife:			true,
        gas:				true,
        atm:				true,
        parks:				true,
        rvda:				false,
        videos:				false,
        sponsorCategories:	false,
        print:				true,
        email:				true,

        end: null
    },

    end: null
};

deCarta.App.Configuration = {
	configure:function(){
//		console.log( "allstate-map Configuration.js ..." );

	  	Credentials.url = decartaUrl;
	  	Credentials.clientName  = decartaUserName;
	  	Credentials.clientPassword = decartaPassword;

		if(!Credentials.clientName || !Credentials.clientPassword){
			alert("please configure js/Configuration.js before proceeding");
		}

		Credentials.configuration = decartaConfiguration;
		Credentials.transparentConfiguration=decartaTransparentConfiguration;

		// Digital Globe PROD
//		Credentials.dgkey = "ZC86Y5FfS1iGEZrk7B5kVQfzUwVirdnH";
 Credentials.CONNECTID = "1b2e2a44-5009-40bb-875e-4fa11b45bcba";
        Credentials.projection = 'EPSG:3857';

		deCarta.App.Configuration.locale = new Locale(deCarta.App.UserPreferences.language, deCarta.App.UserPreferences.country);
	},

	locale: new Locale('EN','US'),
	usePOIPriorities : true
}

console.log( "<-- Configuration.js" );
