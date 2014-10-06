#!/usr/bin/perl
use strict;
use warnings;

my $AMOUNT_IN_MONEY = 40;   # dollars
$AMOUNT_IN_MONEY = $ARGV[0] if defined $ARGV[0];
my $AMOUNT_IN_GALLON = 4;   # gallons
$AMOUNT_IN_GALLON = $ARGV[1] if defined $ARGV[1];
my $MILEAGE = 22;   # miles per gallon
$MILEAGE = $ARGV[2] if defined $ARGV[2];

sub fetch {
    my ($id) = @_;
    #my $cmd = sprintf('curl -H "X-AjaxPro-Method: gusd" --data \'{"id":"%d","iFeedID":0}\' "http://www.sandiegogasprices.com/ajaxpro/GasBuddy_ASPX.GasTempMap,GasBuddy_ASPX.ashx"', $id);
    my $cmd = sprintf('curl -H "Accept-Encoding: gzip,deflate,sdch" -H "X-AjaxPro-Method: gusd" --data \'{"id":"%d","iFeedID":0}\' "http://www.sandiegogasprices.com/ajaxpro/GasBuddy_ASPX.GasTempMap,GasBuddy_ASPX.ashx" 2> /dev/null | gunzip -c | tee gas' . $id, $id);
    ####print $cmd . $/;
#   open(my $f, "$cmd |") or die 'pipe: oops';
    open(my $f, "<", sprintf("gas%d", $id)) or die 'oops';
    my $json_x = do {local $/ = undef; <$f>};
    #print $json_x;
    close $f or die 'oops';
#   my $x = $json_x;
#   print "ok\n" if $x =~ s/new GBAjaxPro.Web.Data.*?\(//g;
#   print "ok\n" if $x =~ s/new Date\((\d+),(\d+),(\d+),(\d+),(\d+).*?\)/"$1-${\(1 + $2)}-${\(1 + $3)} $4:00"/g;
#   print "ok\n" if $x =~ s/\)//g;
#   print "ok\n" if $x =~ s/^\{"value"://;
#   chop $x;
#   print $x . $/;
#   my $a_ref = eval( $x );
#   print 'oops' unless defined $a_ref;
#   print '' . @{ $a_ref } . $/;
#   #print ref( $a_ref ) . $/;
#   #print '' . @{ $a_ref } . $/;
#   exit;
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
#       printf "[%d]: |%s| -> |%s|\n", $i, $key[$i][0], $val[$i];
    }
    return (
        sprintf('%s%s', $hash{'station_nm'}, length($hash{'station_alias'}) == 0 ? '' : (' (' . $hash{'station_alias'} . ')')),
        sprintf('%s, %s, %s %s', $hash{'address'}, $hash{'city'}, $hash{'state'}, $hash{'postal_code'}),
        $hash{'reg_price'}, $hash{'reg_tme'}
    );
}

sub gas_price_info {
    my ($key_ex_x, $val_ex_x) = @_;
    my @key_ex = @{ eval($key_ex_x) };
    # [[3.41,"Regular Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",1,2,"A","Reg Cash"],[3.51,"Midgrade Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",2,2,"B","Mid Cash"],[3.61,"Premium Cash",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",3,2,"C","Prem Cash"],[0,"Diesel Cash",new Date(1900,0,1,0,0,0,0),"","","",4,2,"D","Diesel Cash"],[3.51,"Regular Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",1,1,"A","Reg Credit"],[3.61,"Midgrade Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",2,1,"B","Mid Credit"],[3.71,"Premium Credit",new Date(2014,9,3,22,32,20,713),"AShortley","redcon.gif","",3,1,"C","Prem Credit"],[0,"Diesel Credit",new Date(1900,0,1,0,0,0,0),"","","",4,1,"D","Diesel Credit"]]
    $val_ex_x =~ s/new Date\((\d+),(\d+),(\d+),(\d+),(\d+).*?\)/"$1-${\(1 + $2)}-${\(1 + $3)} $4:00"/g;
    my @val_ex = @{ eval($val_ex_x) };
#   print @val_ex . $/; # > 4: credit card info available, otherwise cash only
##  for my $val_ex_ref (@val_ex) {
##      for (my $i = 0; $i < $#key_ex; ++$i) {
##          print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $val_ex_ref->[$i]) . $/;
##      }
##  }
    my $regular_cash_ref = $val_ex[0];
##  for (my $i = 0; $i < $#key_ex; ++$i) {
##      print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $regular_cash_ref->[$i]) . $/;
##  }
    my $regular_cash_price = $regular_cash_ref->[0];
    my $regular_cash_date = $regular_cash_ref->[2];
#   printf "cash: %s (%s)\n", $regular_cash_price, $regular_cash_date;
    my ($regular_credit_ref, $regular_credit_price, $regular_credit_date);
    $regular_credit_ref = @val_ex > 4 ? $val_ex[4] : undef;
    if (@val_ex > 4) {
        $regular_credit_ref = $val_ex[4];
#       for (my $i = 0; $i < $#key_ex; ++$i) {
#           print sprintf('a[%d]: |%s| -> |%s|', $i, $key_ex[$i][0], $regular_credit_ref->[$i]) . $/;
#       }
        $regular_credit_price = $regular_credit_ref->[0];
        $regular_credit_date = $regular_credit_ref->[2];
#       printf "credit card: %s (%s)\n", $regular_credit_price, $regular_cash_date;
    } else {
#       printf "credit card: Cash Only\n";
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
    return (@a, @b);
}

sub calc {
    my ($price, $dist) = @_;    # dollars per gallon, miles
#   for (my $i = 0; $i < @ARGV; ++$i) {
#       print sprintf("ARGV[%d]: |%s|", $i, $ARGV[$i]), $/;
#   }
#   printf "AMOUNT_IN_MONEY: %.f, AMOUNT_IN_GALLON: %.f, MILEAGE: %.0f\n", $AMOUNT_IN_MONEY, $AMOUNT_IN_GALLON, $MILEAGE;
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
#   printf("%.2f (%.f dollars), %.2f (%.f gallons) with %.f mileage\n", $a, $AMOUNT_IN_MONEY, $b, $AMOUNT_IN_GALLON, $MILEAGE);
    return ($a, $AMOUNT_IN_MONEY, $b, $AMOUNT_IN_GALLON, $MILEAGE);
}

sub choose_price {
    my ($posted, $cash, $credit_card) = @_;

    if (0) {
        printf
            "    %.2f (posted)\n" .
            "    %.2f (cash)\n" .
            "    %s (credit card)\n"
            ,
            $_[0], $_[1], defined($_[2]) ? sprintf("%.2f", $_[2]) : "undef"
        ;
    }
    return $_[1] > 0 ? $_[1] : $_[0];
}


#print values(%ENV);
my @station = ( # array of references to array
    [29845, 11.0, "Han's Auto"],
    [18186, 11.0, "C Stop"],
    [18187, 10.1, "Vons"],
    [12302,  9.4, "Varso"],
    [32501,  4.5, "Rancho Bernado ARCO"],
    [19669,  2.4, "We Got It"],
    [10044,  3.3, "Sabre Springs"],
    [26742,  5.4, "near 99 cents"],
    [12396,  5.8, "Poway ARCO"],
    [ 5284, 18.4, "Ranoma ARCO"],
    [12303, 13.9, "Balboa ARCO"],
    [32500,  3.4, "near Target, Poway"],
    [27790,  1.7, "shell in Carmel Mountain"],
);

my @result; # array of references to array
            #   [
            #       ## from @station (3)
            #       id(0), distance(1), comment(2)
            #       ## from a call to gas (6)
            #       # from gas_stataion_info
            #       name(3), address(4), posted price(5), posted date(6)
            #       # from gas_price_info
            #       regular cash price(7), regular cash date(8),
            #       regular credit card price(9), regular credit card date(10) # both might be undefined (cash only)
            #       # from a call to calc (5)
            #       adjusted regular cash price given dollars(11), given dollars (12),
            #       adjusted regular cash price given gallons(13), given gallons (14),
            #       mileage (15)
            #   ]
sub report {
    for (@_) {
        printf
            "%s [#%s]: %s\n" .
            "%s (%.1f miles)\n" .
            "    %.2f (posted)\n" .
            "    %.2f (cash)\n" .
            "    %s (credit card)\n"
            ,
            $_->[3], $_->[0], $_->[2],
            $_->[4], $_->[1],
            $_->[5], $_->[7], defined($_->[9]) ? sprintf("%.2f", $_->[9]) : "undef"
        ;
        printf
            "    adjusted: %.2f (\$%.f), %.2f (%.f gal) based on mileage: %.f (m/gal)\n"
            ,
            $_->[11], $_->[12], $_->[13], $_->[14], $_->[15]
        ;
    }
}

for (@station) {
#   print $_->[2], $/;
    print '.';
    my @r = gas($_->[0]);
    #push @result, [ @{ $_ }, @r, calc($r[4], $_->[1]) ];
    push @result, [ @{ $_ }, @r, calc(choose_price($r[2], $r[4], $r[6]), $_->[1]) ];
}
printf "\r%s\r", " " x @station;

print 'sort by "posted or cash" prices', $/;
print '----------------------------' . $/;
#report(sort {$a->[7] <=> $b->[7]} @result);
report(sort {choose_price($a->[5], $a->[7], $a->[9]) <=> choose_price($b->[5], $b->[7], $b->[9])} @result);
print '----------------------------' . $/;
print $/;

print 'sort by "adjusted" cash prices in given dollars = ' . $AMOUNT_IN_MONEY . $/;
print '----------------------------' . $/;
report(sort {$a->[11] <=> $b->[11]} @result);
print '----------------------------' . $/;
print $/;

print 'sort by "adjusted" cash prices in given gallons = ' . $AMOUNT_IN_GALLON . $/;
print '----------------------------' . $/;
report(sort {$a->[13] <=> $b->[13]} @result);
print '----------------------------' . $/;
print $/;
