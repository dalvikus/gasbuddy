#!/usr/bin/perl

use strict;
use warnings;

use LWP::Simple;

my $url = "http://dictionary.cambridge.org/dictionary/british/dick_1";

my $content = get $url;

open(my $out, ">", "y.html") or die 'oops';
print $out $content;

