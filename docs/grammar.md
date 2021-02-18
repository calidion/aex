# Grammar Diagram

## parser URL

https://bottlecaps.de/rr/ui

## Grammar Descriptor

``` grammar
Web_Straight_Line
         ::= 
( 'Request' | http | websocket )
( 'routing' | method url )
( 'authoriation' | cookie | session | http-auth )
( 'data parsing' | query | formdata | files )
( 'policy' | isLogined | isOwner | isAdmin | '...' )
( 'bussiness logic' | ((  'command' | (get process) )  ouput))
('Response' | html | xml | json | rest | graphql | stream '...')
```
