#!/usr/bin/perl
use strict;
use warnings;
=raw
my $cmd = sprintf('curl -H "X-AjaxPro-Method: gusd" --data \'{"id":"%d","iFeedID":0}\' "http://www.sandiegogasprices.com/ajaxpro/GasBuddy_ASPX.GasTempMap,GasBuddy_ASPX.ashx"', 29845);
open(my $f, "$cmd 2> /dev/null |") or die 'pipe: oops';
my $xxx = do {local $/ = undef; <$f>};
print $xxx;
close $f or die 'oops';
my $station_id_list_ref = [
    [29845, "# Han's Auto"],
    [18187, "# Vons"],
    [32501, "# Rancho Bernado ARCO"],
    [19669, "# We Got It"],
    [10044, "# Sabre Springs"],
    [26742, "# 99"],
    [12396, "# Poway ARCO"],
    [5284,  "# Ranoma ARCO"],
    [12303, "# Balboa ARCO"],
];
print $station_id_list_ref . $/;
#print $#{ $station_id_list_ref } . $/; exit;
print $station_id_list_ref->[0]->[0] . $/;
#open(my $f, '<', 'gas') or die 'oops';
#my $gas = do {local $/ = undef; <$f>};
#close $f or die 'oops';
#print $gas;

$xxx =~ /^.*?new GBAjaxPro.Web.DataTable\((\[\[.*?\]\]),\[(\[.*?\])\]\),.*$/;
print $1 . $/;
my @b = @{ eval($1) };
for (my $i = 0; $i <= $#b; ++$i) {
    #print ref($b[$i]) . $/;
    print $b[$i][0] . $/;
}
print $2 . $/;
my $x = $2;
$x =~ s/false/0/g;
$x =~ s/true/0/g;
# new Date(2014,9,3,21,15,0,0)
$x =~ s/new Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+).*?\)/"$1-$2-$3 $4:$5"/g;
print $x . $/;
#my $a_ref = eval($x);
#print $$a_ref[0] . $/;
my @a = @{ eval($x) };
print $a[0] . $/;
for (my $i = 0; $i <= $#a; ++$i) {
    print 'a[' . $i . ']: |' . $a[$i] . '|' . $/;
    print sprintf('a[%d]: |%s|', $i, $a[$i]) . $/;
}
#a[0]: station_nm
print $#a, $#b, $/;

my %a;
for (my $i = 0; $i < $#a; ++$i) {
    $a{ $b[$i][0] } = $a[$i];
    print sprintf('a[%d]: |%s| -> |%s|', $i, $b[$i][0], $a[$i]) . $/;
}
print $a{ 'station_nm' } . $/;
my $r = sprintf(
    '%s %s %s (%s): %s, %s, %s %s'
    ,
    $a{'reg_price'}, $a{'reg_tme'},
    $a{'station_nm'}, $a{'station_alias'},
    $a{'address'}, $a{'city'}, $a{'state'}, $a{'postal_code'}
);
print $r . $/;
=cut

sub fetch {
    my ($id) = @_;
    #my $cmd = sprintf('curl -H "X-AjaxPro-Method: gusd" --data \'{"id":"%d","iFeedID":0}\' "http://www.sandiegogasprices.com/ajaxpro/GasBuddy_ASPX.GasTempMap,GasBuddy_ASPX.ashx"', $id);
    my $cmd = sprintf('curl -H "Accept-Encoding: gzip,deflate,sdch" -H "X-AjaxPro-Method: gusd" --data \'{"id":"%d","iFeedID":0}\' "http://www.sandiegogasprices.com/ajaxpro/GasBuddy_ASPX.GasTempMap,GasBuddy_ASPX.ashx" 2> /dev/null | gunzip -c', $id);
    ####print $cmd . $/;
#   open(my $f, "$cmd |") or die 'pipe: oops';
    open(my $f, "<", sprintf("gas%d", $id)) or die 'oops';
    my $json_x = do {local $/ = undef; <$f>};
    #print $json_x;
    close $f or die 'oops';
    return $json_x;
}

sub gas_stataion_info {
    my ($key_x, $val_x) = @_;

    my @key = @{ eval($key_x) };
    $val_x =~ s/false/0/g;
    $val_x =~ s/true/0/g;
    # new Date(2014,9,3,21,15,0,0) -> "YYYY-MM-DD HH:00"
    $val_x =~ s/new Date\((\d+),(\d+),(\d+),(\d+),(\d+).*?\)/"$1-${\(1 + $2)}-${\(1 + $3)} $4:00"/g;
    my @val = @{ eval($val_x) };
    my %hash;
    for (my $i = 0; $i < $#key; ++$i) {
        $hash{ $key[$i][0] } = $val[$i];
        printf "[%d]: |%s| -> |%s|\n", $i, $key[$i][0], $val[$i];
    }
    return (
        sprintf('%s%s', $hash{'station_nm'}, length($hash{'station_alias'}) == 0 ? '' : (' (' . $hash{'station_alias'} . ')')),
        sprintf('%s, %s, %s %s', $hash{'address'}, $hash{'city'}, $hash{'state'}, $hash{'postal_code'})
    );
}

sub gas_price_info {
    my ($key_ex_x, $val_ex_x) = @_;
    my @key_ex = @{ eval($key_ex_x) };
    # [[3.41,"Regular Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",1,2,"A","Reg Cash"],[3.51,"Midgrade Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",2,2,"B","Mid Cash"],[3.61,"Premium Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",3,2,"C","Prem Cash"],[0,"Diesel Cash",new Date(1900,0,1,0,0,0,0),"","","",4,2,"D","Diesel Cash"],[3.51,"Regular Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",1,1,"A","Reg Credit"],[3.61,"Midgrade Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",2,1,"B","Mid Credit"],[3.71,"Premium Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",3,1,"C","Prem Credit"],[0,"Diesel Credit",new Date(1900,0,1,0,0,0,0),"","","",4,1,"D","Diesel Credit"]]
    $val_ex_x =~ s/new Date\((\d+),(\d+),(\d+),(\d+),(\d+).*?\)/"$1-${\(1 + $2)}-${\(1 + $3)} $4:00"/g;
    my @val_ex = @{ eval($val_ex_x) };
    print @val_ex . $/; # > 4: credit card info available, otherwise cash only
#   for my $val_ex_ref (@val_ex) {
#       for (my $i = 0; $i < $#key_ex; ++$i) {
#           print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $val_ex_ref->[$i]) . $/;
#       }
#   }
    my $regular_cash_ref = $val_ex[0];
#   for (my $i = 0; $i < $#key_ex; ++$i) {
#       print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $regular_cash_ref->[$i]) . $/;
#   }
    my $regular_cash_price = $regular_cash_ref->[0];
    my $regular_cash_date = $regular_cash_ref->[2];
    printf "cash: %s (%s)\n", $regular_cash_price, $regular_cash_date;
    my ($regular_credit_ref, $regular_credit_price, $regular_credit_date);
    $regular_credit_ref = @val_ex > 4 ? $val_ex[4] : undef;
    if (@val_ex > 4) {
        $regular_credit_ref = $val_ex[4];
#       for (my $i = 0; $i < $#key_ex; ++$i) {
#           print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $regular_credit_ref->[$i]) . $/;
#       }
        $regular_credit_price = $regular_credit_ref->[0];
        $regular_credit_date = $regular_credit_ref->[2];
        printf "credit card: %s (%s)\n", $regular_credit_price, $regular_cash_date;
    } else {
        printf "credit card: Cash Only";
    }
    return ($regular_cash_price, $regular_cash_date, $regular_credit_price, $regular_credit_date);
}

sub gas {
    my ($id) = @_;
    my $json_x = fetch($id);
####$json_x =~ /^.*?new GBAjaxPro.Web.DataTable\((\[\[.*?\]\]),\[(\[.*?\])\]\),.*$/;
    $json_x =~ /^.*?new GBAjaxPro.Web.DataTable\((\[\[.*?\]\]),\[(\[.*?\])\]\),.*?new GBAjaxPro.Web.DataTable.*?new GBAjaxPro.Web.DataTable\((\[\[.*?\]\]),(\[\[.*?\]\])\).*$/;
    my @a = gas_stataion_info($1, $2);
    my @b = gas_price_info($3, $4);
    my @key = @{ eval($1) };
    my $val_x = $2;
    my @key_ex = @{ eval($3) };
    # [[3.41,"Regular Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",1,2,"A","Reg Cash"],[3.51,"Midgrade Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",2,2,"B","Mid Cash"],[3.61,"Premium Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",3,2,"C","Prem Cash"],[0,"Diesel Cash",new Date(1900,0,1,0,0,0,0),"","","",4,2,"D","Diesel Cash"],[3.51,"Regular Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",1,1,"A","Reg Credit"],[3.61,"Midgrade Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",2,1,"B","Mid Credit"],[3.71,"Premium Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",3,1,"C","Prem Credit"],[0,"Diesel Credit",new Date(1900,0,1,0,0,0,0),"","","",4,1,"D","Diesel Credit"]]
    my $val_ex_x = $4;
    $val_ex_x =~ s/new Date\((\d+),(\d+),(\d+),(\d+),(\d+).*?\)/"$1-${\(1 + $2)}-${\(1 + $3)} $4:00"/g;
    my @val_ex = @{ eval($val_ex_x) };
    print @val_ex . $/;
#   for my $val_ex_ref (@val_ex) {
#       for (my $i = 0; $i < $#key_ex; ++$i) {
#           print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $val_ex_ref->[$i]) . $/;
#       }
#   }
    my $regular_cash_ref = $val_ex[0];
#   for (my $i = 0; $i < $#key_ex; ++$i) {
#       print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $regular_cash_ref->[$i]) . $/;
#   }
    my $regular_cash_price = $regular_cash_ref->[0];
    my $regular_cash_date = $regular_cash_ref->[2];
    my $regular_credit_ref = $#val_ex >= 4 ? $val_ex[4] : undef;
#   for (my $i = 0; $i < $#key_ex; ++$i) {
#       print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $regular_credit_ref->[$i]) . $/;
#   }
    my $regular_credit_price = defined($regular_credit_ref) ? $regular_credit_ref->[0] : undef;
    my $regular_credit_date = defined($regular_credit_ref) ? $regular_credit_ref->[2] : undef;
    #print sprintf('cash: %s (%s), credit: %s (%s)', $regular_cash_price, $regular_cash_date, $regular_credit_price, $regular_cash_date) . $/;

    $val_x =~ s/false/0/g;
    $val_x =~ s/true/0/g;
    # new Date(2014,9,3,21,15,0,0)
    $val_x =~ s/new Date\((\d+),(\d+),(\d+),(\d+),(\d+).*?\)/"$1-${\(1 + $2)}-${\(1 + $3)} $4:00"/g;
#   print $x . $/;
    #my $a_ref = eval($x);
    #print $$a_ref[0] . $/;
    my @val = @{ eval($val_x) };
    my %hash;
    for (my $i = 0; $i < $#key; ++$i) {
        $hash{ $key[$i][0] } = $val[$i];
        #print sprintf('a[%d]: |%s| -> |%s|', $i, $key[$i][0], $val[$i]) . $/;
    }
    return splice(@a, @a, 0, @b);
    return [
        $regular_cash_price, $regular_cash_date,
        $regular_credit_price, $regular_credit_date,
        #$hash{'reg_price'},
        #$hash{'reg_tme'},
        #sprintf('%s (%s)', $hash{'station_nm'}, $hash{'station_alias'}),
        sprintf('%s%s', $hash{'station_nm'}, length($hash{'station_alias'}) == 0 ? '' : (' (' . $hash{'station_alias'} . ')')),
        sprintf('%s, %s, %s %s', $hash{'address'}, $hash{'city'}, $hash{'state'}, $hash{'postal_code'})
    ];
}

#print values(%ENV);
my @station_id_list = (
#   (29845, "Han's Auto", 11.0),
    (18186, "C Stop", 11.0),
    (18187, "Vons", 10.1),
#   (12302, "Varso", 9.4),
    (32501, "Rancho Bernado ARCO", 4.5),
#   (19669, "We Got It", 2.4),
#   (10044, "Sabre Springs", 3.3),
#   (26742, "99", 5.4),
#   (12396, "Poway ARCO", 5.8),
#   (5284,  "Ranoma ARCO", 18.4),
#   (12303, "Balboa ARCO", 13.9),
);
exit;
my @result;
for (@station_id_list}) {
    my @r = gas($_[0]);
    print @r, $/;
    #print '.';
    push @result, splice(@_, @_, 0, @r);
}
#print sprintf("\r%s\r", ' ' x @{ $station_id_list_ref });
=head
for my $list_ref (@result) {
    #print $list_ref . $/;
    #print ref($list_ref) . $/;
    print sprintf(
        "%s [#%s]\n" .
        "%s\n" .
        "    %s [%s]: Cash: %s\n" .
        #"    %s [%s]: Credit Card\n" .
        "    %s\n" .
        ""
        ,
        $list_ref->[1]->[4],
        $list_ref->[0],
        $list_ref->[1]->[5],
        $list_ref->[1]->[0],
        $list_ref->[1]->[1],
        cal($list_ref->[1]->[0], $list_ref->[3]),
        defined($list_ref->[1]->[2]) ? sprintf("%s [%s]: Credit Card", $list_ref->[1]->[2], $list_ref->[1]->[3]) : "Cash Only",
        #$list_ref->[1]->[2],
        #$list_ref->[1]->[3],
        #$list_ref->[1]->[6],
        #$list_ref->[1]->[7],
    ) . $/;
}
=cut

sub cal {
    my ($price, $dist) = @_;    # dollars per gallon, miles
    #print "$price, $dist", $/;
#   for (my $i = 0; $i < @ARGV; ++$i) {
#       print sprintf("ARGV[%d]: |%s|", $i, $ARGV[$i]), $/;
#   }
    my $AMOUNT_IN_MONEY = 80;   # dollars
    $AMOUNT_IN_MONEY = $ARGV[0] if defined $ARGV[0];
    my $AMOUNT_IN_GALLON = 4;   # gallons
    $AMOUNT_IN_GALLON = $ARGV[1] if defined $ARGV[1];
    my $MILEAGE = 22;   # miles per gallon
    $MILEAGE = $ARGV[2] if defined $ARGV[2];
    #printf "AMOUNT_IN_MONEY: %.f, AMOUNT_IN_GALLON: %.f, MILEAGE: %.0f\n", $AMOUNT_IN_MONEY, $AMOUNT_IN_GALLON, $MILEAGE;
    # consume (2 * $dist / $MILEAGE) gallons
=calc
    print sprintf("spend: %s dollars", $AMOUNT_IN_MONEY), $/;
    print sprintf("consume: %.2f gallons", 2 * $dist / $MILEAGE) . $/;
    print sprintf("purchase: %.2f gallons", $AMOUNT_IN_MONEY / $price), $/;
    print sprintf("total: %.2f gallons", $AMOUNT_IN_MONEY / $price - 2 * $dist / $MILEAGE), $/;
    printf "net price: %.2f (%.2f) dollars / gallon with %.0f dollars\n", $AMOUNT_IN_MONEY / ($AMOUNT_IN_MONEY / $price - 2 * $dist / $MILEAGE), $price, $AMOUNT_IN_MONEY;
    printf "net price: %.2f (%.2f) dollars / gallon with %.0f gallons\n", ($price * $AMOUNT_IN_GALLON) / ($AMOUNT_IN_GALLON - 2 * $dist / $MILEAGE), $price, $AMOUNT_IN_GALLON;
=cut
    my $a = $AMOUNT_IN_MONEY / ($AMOUNT_IN_MONEY / $price - 2 * $dist / $MILEAGE);
    my $b = ($price * $AMOUNT_IN_GALLON) / ($AMOUNT_IN_GALLON - 2 * $dist / $MILEAGE);
    return sprintf("%.2f (%.f dollars), %.2f (%.f gallons) with %.f mileage", $a, $AMOUNT_IN_MONEY, $b, $AMOUNT_IN_GALLON, $MILEAGE);
print $a, $b, $/;
    return ($a, $b);
}
