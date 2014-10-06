#!/usr/bin/perl

use strict;
use warnings;

use URI::Escape;

=from
http://wsdds32.prod.sv.decartahws.com/openls/JSON?reqID=7681793&chunkNo=1&numChunks=1&callback=JSRequest.callbackRegistry&data=%3Cxls%3AXLS%20version%3D%271%27%20xls%3Alang%3D%27en%27%20xmlns%3Axls%3D%27http%3A%2F%2Fwww.opengis.net%2Fxls%27%20rel%3D%275.1%27%20xmlns%3Agml%3D%27http%3A%2F%2Fwww.opengis.net%2Fgml%27%3E%3Cxls%3ARequestHeader%20clientName%3D%27randmcnally%3Armc%27%20sessionID%3D%276599859%27%20clientAPI%3D%27desktopjs%27%20clientPassword%3D%278161tfj0tT%27%20configuration%3D%27global-decarta%27%2F%3E%3Cxls%3ARequest%20maximumResponses%3D%2710%27%20version%3D%271.0%27%20requestID%3D%277681793%27%20methodName%3D%27GeocodeRequest%27%3E%3Cxls%3AGeocodeRequest%20returnFreeForm%3D%27false%27%3E%3Cxls%3AAddress%20countryCode%3D%27US%27%20language%3D%27EN%27%3E%3Cxls%3AfreeFormAddress%3E14141%20caminito%20quevedo%2C%20san%20diego%2C%20ca%2092129%3C%2Fxls%3AfreeFormAddress%3E%3C%2Fxls%3AAddress%3E%3C%2Fxls%3AGeocodeRequest%3E%3C%2Fxls%3ARequest%3E%3C%2Fxls%3AXLS%3E&responseFormat=JSON

reqID=7681793
chunkNo=1
numChunks=1
callback=JSRequest.callbackRegistry
data=<xls:XLS version='1' xls:lang='en' xmlns:xls='http://www.opengis.net/xls' rel='5.1' xmlns:gml='http://www.opengis.net/gml'><xls:RequestHeader clientName='randmcnally:rmc' sessionID='6599859' clientAPI='desktopjs' clientPassword='8161tfj0tT' configuration='global-decarta'/><xls:Request maximumResponses='10' version='1.0' requestID='7681793' methodName='GeocodeRequest'><xls:GeocodeRequest returnFreeForm='false'><xls:Address countryCode='US' language='EN'><xls:freeFormAddress>14141 caminito quevedo, san diego, ca 92129</xls:freeFormAddress></xls:Address></xls:GeocodeRequest></xls:Request></xls:XLS>
responseFormat=JSON

Host: wsdds32.prod.sv.decartahws.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:32.0) Gecko/20100101 Firefox/32.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://maps.randmcnally.com/mileage-calculator.do
Connection: keep-alive

JSRequest.callbackRegistry({"requestID":7681793,
"chunkNo":1,
"responseFormat":"JSON",
"response":{"XLS":{"ns1":"http://www.opengis.net/xls","ResponseHeader":{"sessionID":6599859},"Response":{"numberOfResponses":1,"requestID":7681793,"GeocodeResponse":{"GeocodeResponseList":{"GeocodedAddress":{"GeocodeMatchCode":{"matchType":"PATTERN MATCH","accuracy":1},"Address":{"Place":[{"content":"CA","type":"CountrySubdivision"},{"content":"San Diego","type":"CountrySecondarySubdivision"},{"content":"San Diego","type":"Municipality"}],"PostalCode":"\"92129\"","countryCode":"US","StreetAddress":{"Street":"Caminito Quevedo","Building":{"number":14141}}},"Point":{"ns2":"http://www.opengis.net/gml","pos":"32.967253 -117.095145"}},"numberOfGeocodedAddresses":1}},"version":1},"rel":"5.2.sp04","lang":"en","version":1}}
})
=cut

=to
http://wsdds32.prod.sv.decartahws.com/openls/JSON?reqID=9281329&chunkNo=1&numChunks=1&callback=JSRequest.callbackRegistry&data=%3Cxls%3AXLS%20version%3D%271%27%20xls%3Alang%3D%27en%27%20xmlns%3Axls%3D%27http%3A%2F%2Fwww.opengis.net%2Fxls%27%20rel%3D%275.1%27%20xmlns%3Agml%3D%27http%3A%2F%2Fwww.opengis.net%2Fgml%27%3E%3Cxls%3ARequestHeader%20clientName%3D%27randmcnally%3Armc%27%20sessionID%3D%27915218%27%20clientAPI%3D%27desktopjs%27%20clientPassword%3D%278161tfj0tT%27%20configuration%3D%27global-decarta%27%2F%3E%3Cxls%3ARequest%20maximumResponses%3D%2710%27%20version%3D%271.0%27%20requestID%3D%279281329%27%20methodName%3D%27GeocodeRequest%27%3E%3Cxls%3AGeocodeRequest%20returnFreeForm%3D%27false%27%3E%3Cxls%3AAddress%20countryCode%3D%27US%27%20language%3D%27EN%27%3E%3Cxls%3AfreeFormAddress%3E434%20w%205th%20ave%2C%20escondido%2C%20ca%2092025-4829%3C%2Fxls%3AfreeFormAddress%3E%3C%2Fxls%3AAddress%3E%3C%2Fxls%3AGeocodeRequest%3E%3C%2Fxls%3ARequest%3E%3C%2Fxls%3AXLS%3E&responseFormat=JSON

reqID=9281329
chunkNo=1
numChunks=1
callback=JSRequest.callbackRegistry
data=<xls:XLS version='1' xls:lang='en' xmlns:xls='http://www.opengis.net/xls' rel='5.1' xmlns:gml='http://www.opengis.net/gml'><xls:RequestHeader clientName='randmcnally:rmc' sessionID='915218' clientAPI='desktopjs' clientPassword='8161tfj0tT' configuration='global-decarta'/><xls:Request maximumResponses='10' version='1.0' requestID='9281329' methodName='GeocodeRequest'><xls:GeocodeRequest returnFreeForm='false'><xls:Address countryCode='US' language='EN'><xls:freeFormAddress>434 w 5th ave, escondido, ca 92025-4829</xls:freeFormAddress></xls:Address></xls:GeocodeRequest></xls:Request></xls:XLS>
responseFormat=JSON

Host: wsdds32.prod.sv.decartahws.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:32.0) Gecko/20100101 Firefox/32.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://maps.randmcnally.com/mileage-calculator.do
Connection: keep-alive

JSRequest.callbackRegistry({"requestID":9281329,
"chunkNo":1,
"responseFormat":"JSON",
"response":{"XLS":{"ns1":"http://www.opengis.net/xls","ResponseHeader":{"sessionID":915218},"Response":{"numberOfResponses":1,"requestID":9281329,"GeocodeResponse":{"GeocodeResponseList":{"GeocodedAddress":{"GeocodeMatchCode":{"matchType":"ADDRESS POINT LOOKUP","accuracy":1},"Address":{"Place":[{"content":"CA","type":"CountrySubdivision"},{"content":"San Diego","type":"CountrySecondarySubdivision"},{"content":"Escondido","type":"Municipality"}],"PostalCode":"\"92025\"","countryCode":"US","StreetAddress":{"Street":"W 5th Ave","Building":{"number":434}}},"Point":{"ns2":"http://www.opengis.net/gml","pos":"33.115641 -117.08377"}},"numberOfGeocodedAddresses":1}},"version":1},"rel":"5.2.sp04","lang":"en","version":1}}
})
=cut
sub getCoordinates
{
    my ($addr) = @_;
    my $url =
        "http://wsdds32.prod.sv.decartahws.com/openls/JSON?reqID=7681793&chunkNo=1&numChunks=1&callback=JSRequest.callbackRegistry&data=%3Cxls%3AXLS%20version%3D%271%27%20xls%3Alang%3D%27en%27%20xmlns%3Axls%3D%27http%3A%2F%2Fwww.opengis.net%2Fxls%27%20rel%3D%275.1%27%20xmlns%3Agml%3D%27http%3A%2F%2Fwww.opengis.net%2Fgml%27%3E%3Cxls%3ARequestHeader%20clientName%3D%27randmcnally%3Armc%27%20sessionID%3D%276599859%27%20clientAPI%3D%27desktopjs%27%20clientPassword%3D%278161tfj0tT%27%20configuration%3D%27global-decarta%27%2F%3E%3Cxls%3ARequest%20maximumResponses%3D%2710%27%20version%3D%271.0%27%20requestID%3D%277681793%27%20methodName%3D%27GeocodeRequest%27%3E%3Cxls%3AGeocodeRequest%20returnFreeForm%3D%27false%27%3E%3Cxls%3AAddress%20countryCode%3D%27US%27%20language%3D%27EN%27%3E%3Cxls%3AfreeFormAddress%3E" .
      # "14141 caminito quevedo, san diego, ca 92129"
      # "14141%20caminito%20quevedo%2C%20san%20diego%2C%20ca%2092129" .
        uri_escape($addr) .
        "%3C%2Fxls%3AfreeFormAddress%3E%3C%2Fxls%3AAddress%3E%3C%2Fxls%3AGeocodeRequest%3E%3C%2Fxls%3ARequest%3E%3C%2Fxls%3AXLS%3E&responseFormat=JSON";
    my $cmd = sprintf('curl -H "Accept-Encoding: gzip,deflate,sdch" "%s" 2> /dev/null | gunzip -c', $url);
    open(my $f, "$cmd |") or die 'pipe: oops';
    my $json_x = do {local $/ = undef; <$f>};
    close $f or die 'oops';
    #print $json_x, $/;
    # JSRequest.callbackRegistry({...})
    my $HEAD = "JSRequest.callbackRegistry(";
    my $json = substr $json_x, length( $HEAD );
    chop $json;
    #print $json,$/;
    $json =~ s/:/=>/g;
    my $d_ref = eval( $json );
    return $d_ref->{'response'}->{'XLS'}->{'Response'}->{'GeocodeResponse'}->{'GeocodeResponseList'}->{'GeocodedAddress'}->{'Point'}->{'pos'};
}
my $from = "14141 caminito quevedo, san diego, ca 92129";
my $to = "5793 Alton Pkwy, Irvine, CA 92618-4057";
$to = $ARGV[0] if defined( $ARGV[0] );
$from = $ARGV[1] if defined( $ARGV[1] );
my $from_pos = getCoordinates($from);
print $from_pos, $/;
my $to_pos = getCoordinates($to);
print $to_pos, $/;

=output
http://wsdds32.prod.sv.decartahws.com/openls/JSON?reqID=2614332&chunkNo=1&numChunks=1&callback=JSRequest.callbackRegistry&data=%3Cxls%3AXLS%20version%3D%271%27%20xls%3Alang%3D%27en%27%20xmlns%3Axls%3D%27http%3A%2F%2Fwww.opengis.net%2Fxls%27%20rel%3D%275.1%27%20xmlns%3Agml%3D%27http%3A%2F%2Fwww.opengis.net%2Fgml%27%3E%3Cxls%3ARequestHeader%20clientName%3D%27randmcnally%3Armc%27%20sessionID%3D%277904038%27%20clientAPI%3D%27desktopjs%27%20clientPassword%3D%278161tfj0tT%27%20configuration%3D%27global-decarta%27%2F%3E%3Cxls%3ARequest%20maximumResponses%3D%2710%27%20version%3D%271.0%27%20requestID%3D%272614332%27%20methodName%3D%27DetermineRouteRequest%27%3E%3Cxls%3ADetermineRouteRequest%20distanceUnit%3D%27MI%27%20routeQueryType%3D%27RTXT%27%20provideRouteHandle%3D%27false%27%3E%3Cxls%3ARoutePlan%3E%3Cxls%3ARoutePreference%3EFastest%3C%2Fxls%3ARoutePreference%3E%3Cxls%3AWayPointList%3E%3Cxls%3AStartPoint%3E%3Cxls%3APosition%3E%3Cgml%3APoint%3E%3Cgml%3Apos%3E32.96725300000000%20-117.09514500000000%3C%2Fgml%3Apos%3E%3C%2Fgml%3APoint%3E%3C%2Fxls%3APosition%3E%3C%2Fxls%3AStartPoint%3E%3Cxls%3AEndPoint%3E%3Cxls%3APosition%3E%3Cgml%3APoint%3E%3Cgml%3Apos%3E33.11564100000000%20-117.08377000000000%3C%2Fgml%3Apos%3E%3C%2Fgml%3APoint%3E%3C%2Fxls%3APosition%3E%3C%2Fxls%3AEndPoint%3E%3C%2Fxls%3AWayPointList%3E%3C%2Fxls%3ARoutePlan%3E%3Cxls%3ARouteInstructionsRequest%20providePoint%3D%27true%27%2F%3E%3Cxls%3ARouteGeometryRequest%20returnRouteIDOnly%3D%27false%27%2F%3E%3C%2Fxls%3ADetermineRouteRequest%3E%3C%2Fxls%3ARequest%3E%3C%2Fxls%3AXLS%3E&responseFormat=JSON

reqID=2614332
chunkNo=1
numChunks=1
callback=JSRequest.callbackRegistry
data=<xls:XLS version='1' xls:lang='en' xmlns:xls='http://www.opengis.net/xls' rel='5.1' xmlns:gml='http://www.opengis.net/gml'><xls:RequestHeader clientName='randmcnally:rmc' sessionID='7904038' clientAPI='desktopjs' clientPassword='8161tfj0tT' configuration='global-decarta'/><xls:Request maximumResponses='10' version='1.0' requestID='2614332' methodName='DetermineRouteRequest'><xls:DetermineRouteRequest distanceUnit='MI' routeQueryType='RTXT' provideRouteHandle='false'><xls:RoutePlan><xls:RoutePreference>Fastest</xls:RoutePreference><xls:WayPointList><xls:StartPoint><xls:Position><gml:Point><gml:pos>32.96725300000000 -117.09514500000000</gml:pos></gml:Point></xls:Position></xls:StartPoint><xls:EndPoint><xls:Position><gml:Point><gml:pos>33.11564100000000 -117.08377000000000</gml:pos></gml:Point></xls:Position></xls:EndPoint></xls:WayPointList></xls:RoutePlan><xls:RouteInstructionsRequest providePoint='true'/><xls:RouteGeometryRequest returnRouteIDOnly='false'/></xls:DetermineRouteRequest></xls:Request></xls:XLS>
responseFormat=JSON

Host: wsdds32.prod.sv.decartahws.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:32.0) Gecko/20100101 Firefox/32.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://maps.randmcnally.com/mileage-calculator.do
Connection: keep-alive

JSRequest.callbackRegistry({"requestID":2614332,
"chunkNo":1,
"responseFormat":"JSON",
"response":{"XLS":{"ns1":"http://www.opengis.net/xls","ResponseHeader":{"sessionID":7904038},"Response":{"numberOfResponses":1,"DetermineRouteResponse":{"RouteGeometry":{"LineString":{"ns4":"http://www.opengis.net/gml","pos":["32.96727 -117.09519","32.96752 -117.09506","32.96768 -117.09547","32.96773 -117.09567","32.96776 -117.09575","32.96802 -117.09606","32.96831 -117.0964","32.96862 -117.09677","32.96976 -117.09539","32.97046 -117.09455","32.97076 -117.09423","32.97093 -117.09406","32.97126 -117.09379","32.9717 -117.09347","32.97236 -117.09309","32.97315 -117.09271","32.9742 -117.09216","32.97504 -117.09174","32.97608 -117.09126","32.97723 -117.09041","32.9775 -117.0902","32.97786 -117.08989","32.97807 -117.08966","32.97825 -117.08941","32.97838 -117.08932","32.9786 -117.08887","32.97867 -117.08864","32.97874 -117.08848","32.97884 -117.08806","32.9789 -117.08761","32.97891 -117.08755","32.97894 -117.08665","32.97893 -117.08637","32.97893 -117.08621","32.97893 -117.08607","32.97893 -117.08593","32.97891 -117.08562","32.97887 -117.08532","32.97923 -117.0853","32.97964 -117.08522","32.98004 -117.08506","32.98052 -117.08478","32.98133 -117.08435","32.98197 -117.08397","32.9826 -117.08378","32.98327 -117.08341","32.98374 -117.08321","32.9842 -117.08304","32.98469 -117.08288","32.98516 -117.08275","32.98541 -117.0827","32.98565 -117.08265","32.98612 -117.08257","32.98662 -117.08252","32.98689 -117.0825","32.98739 -117.08249","32.98784 -117.0825","32.98828 -117.08252","32.98868 -117.08257","32.98908 -117.08264","32.98955 -117.08273","32.99005 -117.08284","32.99035 -117.08291","32.99076 -117.08299","32.99125 -117.0831","32.99173 -117.08319","32.99196 -117.08324","32.99247 -117.08334","32.99296 -117.08342","32.99318 -117.08345","32.9935 -117.08348","32.99393 -117.08351","32.99424 -117.08351","32.99469 -117.08351","32.99527 -117.08347","32.99577 -117.08342","32.99628 -117.08335","32.99679 -117.08327","32.9973 -117.08315","32.99759 -117.08307","32.99778 -117.08302","32.99837 -117.08283","32.99888 -117.08265","32.99942 -117.08245","33.00045 -117.08207","33.0013 -117.08176","33.00161 -117.08164","33.00185 -117.08155","33.00249 -117.08132","33.00295 -117.08115","33.00316 -117.08108","33.00383 -117.08084","33.00425 -117.08071","33.00472 -117.0806","33.00526 -117.08046","33.00579 -117.08034","33.00665 -117.08019","33.00704 -117.08012","33.00836 -117.07997","33.00927 -117.07989","33.00971 -117.07984","33.00988 -117.07982","33.01109 -117.07968","33.01169 -117.07962","33.0119 -117.0796","33.01235 -117.07954","33.0125 -117.07952","33.01315 -117.07946","33.01416 -117.07933","33.01475 -117.07927","33.01564 -117.07915","33.01617 -117.07909","33.01698 -117.079","33.01744 -117.07894","33.01792 -117.07889","33.01882 -117.0788","33.01977 -117.07871","33.02046 -117.07866","33.02074 -117.07864","33.0213 -117.07858","33.02186 -117.07854","33.02235 -117.07852","33.02291 -117.07853","33.02296 -117.07853","33.02312 -117.07853","33.02338 -117.07853","33.02579 -117.0785","33.02697 -117.07851","33.02749 -117.07849","33.02816 -117.07848","33.02851 -117.07847","33.02873 -117.07846","33.02928 -117.07843","33.02983 -117.07838","33.03018 -117.07832","33.03049 -117.07827","33.03094 -117.07819","33.03145 -117.07807","33.03185 -117.07796","33.03223 -117.07785","33.03284 -117.07763","33.03362 -117.07734","33.034 -117.07718","33.03489 -117.0768","33.03546 -117.07656","33.03649 -117.07614","33.03757 -117.07569","33.03826 -117.0754","33.03977 -117.07478","33.04042 -117.07449","33.04099 -117.07426","33.04104 -117.07424","33.04117 -117.07419","33.04171 -117.07397","33.04268 -117.07356","33.04392 -117.07307","33.04446 -117.0729","33.04486 -117.07279","33.04537 -117.07269","33.04581 -117.07263","33.04607 -117.07259","33.0465 -117.07255","33.04706 -117.07255","33.04745 -117.07255","33.04797 -117.07258","33.04897 -117.07265","33.04945 -117.07267","33.04996 -117.07267","33.05019 -117.07266","33.05071 -117.07263","33.05122 -117.07259","33.05196 -117.07247","33.05222 -117.07243","33.0527 -117.07233","33.0534 -117.07215","33.05386 -117.07201","33.05431 -117.07186","33.05474 -117.07169","33.05518 -117.0715","33.0558 -117.07123","33.05647 -117.07087","33.05664 -117.07079","33.05724 -117.07052","33.0577 -117.0703","33.05811 -117.0701","33.05865 -117.06984","33.05934 -117.06956","33.05978 -117.06941","33.06041 -117.06923","33.06088 -117.06911","33.06134 -117.069","33.0618 -117.06891","33.06226 -117.06884","33.06274 -117.06877","33.06297 -117.06874","33.06319 -117.06872","33.06352 -117.06869","33.06413 -117.06867","33.06449 -117.06866","33.06508 -117.06868","33.06572 -117.06874","33.06623 -117.06879","33.06671 -117.06885","33.06741 -117.06895","33.06788 -117.06901","33.06837 -117.06908","33.06888 -117.06916","33.06911 -117.06919","33.06925 -117.06922","33.06958 -117.06928","33.07011 -117.06934","33.07082 -117.06943","33.07113 -117.06947","33.07186 -117.06956","33.07219 -117.0696","33.07298 -117.06971","33.07371 -117.06983","33.07396 -117.06988","33.07411 -117.0699","33.07423 -117.06991","33.07476 -117.06994","33.07547 -117.07006","33.07593 -117.07015","33.0763 -117.07026","33.07694 -117.07044","33.07702 -117.07048","33.07777 -117.07072","33.07842 -117.07099","33.07951 -117.07147","33.08001 -117.07171","33.08075 -117.07207","33.08167 -117.07258","33.08246 -117.07305","33.08357 -117.07376","33.0841 -117.07415","33.08481 -117.0747","33.08498 -117.07484","33.08567 -117.0754","33.08617 -117.07586","33.08651 -117.07617","33.08717 -117.07682","33.08751 -117.07717","33.088 -117.0777","33.08833 -117.07806","33.08918 -117.07898","33.08953 -117.07937","33.09032 -117.08018","33.09096 -117.08089","33.0917 -117.08169","33.09248 -117.08253","33.09389 -117.08403","33.09453 -117.0847","33.09472 -117.0849","33.09544 -117.08568","33.09598 -117.08624","33.09671 -117.08697","33.09726 -117.0875","33.09801 -117.08815","33.09893 -117.08889","33.09966 -117.08946","33.10081 -117.09025","33.10141 -117.09062","33.10282 -117.09144","33.10343 -117.09181","33.10363 -117.09195","33.10425 -117.0923","33.10486 -117.09266","33.1069 -117.09385","33.10845 -117.09476","33.10874 -117.09492","33.10975 -117.09552","33.11035 -117.09587","33.11075 -117.09609","33.11095 -117.09621","33.11224 -117.09697","33.11261 -117.09718","33.11378 -117.09763","33.11422 -117.0978","33.11451 -117.09791","33.11468 -117.09796","33.11496 -117.09804","33.11552 -117.0982","33.11579 -117.0983","33.11694 -117.09635","33.11706 -117.09613","33.11717 -117.0959","33.11725 -117.0957","33.11733 -117.09544","33.11739 -117.09518","33.11742 -117.0949","33.11743 -117.0947","33.11744 -117.09441","33.11743 -117.09423","33.1174 -117.09392","33.11736 -117.09368","33.11715 -117.09282","33.1171 -117.09258","33.11702 -117.09226","33.11696 -117.09193","33.11693 -117.09168","33.11693 -117.09143","33.11695 -117.09119","33.11701 -117.09085","33.11705 -117.09072","33.11718 -117.09042","33.11768 -117.08942","33.11777 -117.08913","33.11782 -117.08891","33.11784 -117.08874","33.11785 -117.0886","33.11785 -117.08832","33.11783 -117.08815","33.11779 -117.08789","33.11776 -117.08767","33.11775 -117.08749","33.11775 -117.08727","33.11777 -117.08709","33.11782 -117.08686","33.11783 -117.08681","33.11803 -117.0863","33.11811 -117.08613","33.11538 -117.08419","33.11545 -117.08404","33.1156 -117.08374"]}},"RouteInstructionsList":{"RouteInstruction":[{"distance":{"value":0},"duration":"PT0H0M0S","description":"route maneuver 1","Instruction":"Proceed northeast on Caminito Quevedo","tour":0,"Point":"32.96727 -117.09519"},{"distance":{"uom":"MI","value":0.02},"duration":"P0DT0H0M5S","description":"route maneuver 2","Instruction":"Turn left on Via San Marco","tour":0,"Point":"32.96752 -117.09506"},{"distance":{"uom":"MI","value":0.13},"duration":"P0DT0H0M38S","description":"route maneuver 3","Instruction":"Turn right on Carmel Mountain Rd","tour":0,"Point":"32.96862 -117.09677"},{"distance":{"uom":"MI","value":1.05},"duration":"P0DT0H3M42S","description":"route maneuver 4","Instruction":"Turn left on I-15 N","tour":0,"Point":"32.97887 -117.08532"},{"distance":{"uom":"MI","value":9.86},"duration":"P0DT0H9M51S","description":"route maneuver 5","Instruction":"Exit right following the sign Downtown (EXIT 31)/Valley Parkway","tour":0,"Point":"33.11261 -117.09718"},{"distance":{"uom":"MI","value":0.23},"duration":"P0DT0H0M50S","description":"route maneuver 6","Instruction":"Turn right on W Valley Pky/CR-S6 N","tour":0,"Point":"33.11579 -117.0983"},{"distance":{"uom":"MI","value":0.65},"duration":"P0DT0H2M15S","description":"route maneuver 7","Instruction":"Continue on W 2nd Ave/CR-S6 N","tour":0,"Point":"33.11779 -117.08789"},{"distance":{"uom":"MI","value":0.11},"duration":"P0DT0H0M23S","description":"route maneuver 8","Instruction":"Turn right on S Centre City Pky","tour":0,"Point":"33.11811 -117.08613"},{"distance":{"uom":"MI","value":0.22},"duration":"P0DT0H0M45S","description":"route maneuver 9","Instruction":"Turn left on W 5th Ave","tour":0,"Point":"33.11538 -117.08419"},{"distance":{"uom":"MI","value":0.03},"duration":"P0DT0H0M9S","description":"route maneuver 10","Instruction":"Arrive at your destination","tour":0,"Point":"33.1156 -117.08374"}],"lang":"english"},"RouteSummary":{"BoundingBox":{"pos":[{"content":"32.96727 -117.0983","ns2":"http://www.opengis.net/gml"},{"content":"33.11811 -117.06866","ns3":"http://www.opengis.net/gml"}]},"TotalDistance":{"uom":"MI","value":12.3},"TotalTime":"P0DT0H20M9S"}},"requestID":2614332,"version":1},"rel":"5.2.sp04","lang":"en","version":1}}
})
=cut
sub getDrivingDistance
{
    my ($from_pos, $to_pos) = @_;
    my $url =
        "http://wsdds32.prod.sv.decartahws.com/openls/JSON?reqID=2614332&chunkNo=1&numChunks=1&callback=JSRequest.callbackRegistry&data=%3Cxls%3AXLS%20version%3D%271%27%20xls%3Alang%3D%27en%27%20xmlns%3Axls%3D%27http%3A%2F%2Fwww.opengis.net%2Fxls%27%20rel%3D%275.1%27%20xmlns%3Agml%3D%27http%3A%2F%2Fwww.opengis.net%2Fgml%27%3E%3Cxls%3ARequestHeader%20clientName%3D%27randmcnally%3Armc%27%20sessionID%3D%277904038%27%20clientAPI%3D%27desktopjs%27%20clientPassword%3D%278161tfj0tT%27%20configuration%3D%27global-decarta%27%2F%3E%3Cxls%3ARequest%20maximumResponses%3D%2710%27%20version%3D%271.0%27%20requestID%3D%272614332%27%20methodName%3D%27DetermineRouteRequest%27%3E%3Cxls%3ADetermineRouteRequest%20distanceUnit%3D%27MI%27%20routeQueryType%3D%27RTXT%27%20provideRouteHandle%3D%27false%27%3E%3Cxls%3ARoutePlan%3E%3Cxls%3ARoutePreference%3EFastest%3C%2Fxls%3ARoutePreference%3E%3Cxls%3AWayPointList%3E%3Cxls%3AStartPoint%3E%3Cxls%3APosition%3E%3Cgml%3APoint%3E%3Cgml%3Apos%3E" .
        # from: pos
        # "32.96725300000000 -117.09514500000000"
        uri_escape( $from_pos ) .
        "%3C%2Fgml%3Apos%3E%3C%2Fgml%3APoint%3E%3C%2Fxls%3APosition%3E%3C%2Fxls%3AStartPoint%3E%3Cxls%3AEndPoint%3E%3Cxls%3APosition%3E%3Cgml%3APoint%3E%3Cgml%3Apos%3E" .
        # to: pos
        # "33.11564100000000 -117.08377000000000"
        uri_escape( $to_pos ) .
        "%3C%2Fgml%3Apos%3E%3C%2Fgml%3APoint%3E%3C%2Fxls%3APosition%3E%3C%2Fxls%3AEndPoint%3E%3C%2Fxls%3AWayPointList%3E%3C%2Fxls%3ARoutePlan%3E%3Cxls%3ARouteInstructionsRequest%20providePoint%3D%27true%27%2F%3E%3Cxls%3ARouteGeometryRequest%20returnRouteIDOnly%3D%27false%27%2F%3E%3C%2Fxls%3ADetermineRouteRequest%3E%3C%2Fxls%3ARequest%3E%3C%2Fxls%3AXLS%3E&responseFormat=JSON";
    my $cmd = sprintf('curl -H "Accept-Encoding: gzip,deflate,sdch" "%s" 2> /dev/null | gunzip -c', $url);
    open(my $f, "$cmd |") or die 'pipe: oops';
    my $json_x = do {local $/ = undef; <$f>};
    close $f or die 'oops';
    #print $json_x, $/;
    my $HEAD = "JSRequest.callbackRegistry(";
    my $json = substr $json_x, length( $HEAD );
    chop $json;
    #print $json,$/;
    $json =~ s/:/=>/g;
    my $d_ref = eval( $json );
    return $d_ref->{'response'}->{'XLS'}->{'Response'}->{'DetermineRouteResponse'}->{'RouteSummary'}->{'TotalDistance'}->{'value'};
}

my $miles = getDrivingDistance( $from_pos, $to_pos );
print $miles, $/;
