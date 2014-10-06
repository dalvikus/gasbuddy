#!/usr/bin/perl -w

use strict;
use warnings;
use Mojo::DOM;

my $html = '<dd class="message">Your HTML goes here</dd>';
open(my $in, "<", "x.html") or die 'oops';
open(my $out, ">", "z.html") or die 'oops';
#my $content = <$in>;
#print '|' . $content . '|' . $/;
#print $out $content;
my @lines;
for (<$in>) {
    push @lines, $_;
    #print $out $_;
}
print $#lines . $/;
my $content = join('', @lines);
print $out $content;
close $in or die 'oops';
close $out or die 'oops';
my $dom = Mojo::DOM->new;
$dom->parse($content);
my $skip;
=a
for my $dd ($dom->find('dd[class*="message"]')->each) {
print "hello, world" . $/;
print $dd . $/;
print $dd->attr . $/;
for my $key (keys %{$dd->attr}) {
    print $key . $/;
}
my $href = $dd->attr;
print $href . $/;
for (keys %$href) {
    print "|$_|" . $/;
}
}
=cut
my $x = $dom->find('div[class*="di-head"]');
print $x . $/;
print $x->text . $/;
print $x->div . $/;
print $x->div->h1 . $/;
print $x->div->h1->text . $/;
print $x->div->h1->to_string . $/;
for my $di_head ($dom->find('div[class*="di-head"]')->each) {
    print $di_head . $/;
}
