#!/usr/bin/perl
use strict;
use warnings;

use vars qw($AMOUNT_IN_MONEY $AMOUNT_IN_GALLON $MILEAGE $REFRESH $FROM);

$REFRESH = 1;
$FROM = 0;  # 0: Home, 1: UC, Irvine

$AMOUNT_IN_MONEY = 40;   # dollars
$AMOUNT_IN_MONEY = $ARGV[0] if defined $ARGV[0];
$AMOUNT_IN_GALLON = 4;   # gallons
$AMOUNT_IN_GALLON = $ARGV[1] if defined $ARGV[1];
$MILEAGE = 22;   # miles per gallon
$MILEAGE = $ARGV[2] if defined $ARGV[2];

require "sub.pl";

#print values(%ENV);
my @station;
if ($FROM == 0) {
    # from Home
    @station = ( # array of references to array
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
        [28407,  2.7, "another shell in Carmel Mountain"],
    );
} else {
    # from UC Irvine
    @station = (
        [11621, 3.6, "a"],
        [22730, 3.7, "b"],
        [26832, 3.2, "c"],
        [35157, 1.7, "d"],
        [15909, 2.1, "e"],
        [94631, 4.3, "f"],
    );
}


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
