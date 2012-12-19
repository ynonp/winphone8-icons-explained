use strict;
use warnings;

use v5.14;

use HTML::Zoom;
use MIME::Base64;
use File::Slurp;
use pQuery;
use Data::Printer;
use LWP::Simple;

sub dataUrl {
    my ( $url, $alt ) = @_;

    my $data = get($url);
    my $encoded = encode_base64( $data,  '' );
    my $dataurl = "data:image/png;base64,$encoded";

    return "<img src=\"$dataurl\" alt=\"$alt\" />";
}

my $filename =  shift || '../index.html';
my $html = read_file( $filename );

$html =~ s/\<img src="([^"]+)" alt="([^"]+)"\>/dataUrl($1, $2)/mesg;

print $html;

write_file('index_dist.html', $html);
