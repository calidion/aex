# Grammar Diagram

## parser URL

https://bottlecaps.de/rr/ui

## Grammar Descriptor

``` grammar
Web_Straight_Line
         ::= ( 'Request' | http | websocket ) ( 'routing' | method url | command message ) ( 'authorization' | cookie | session | http-auth ) ( 'data parsing' | query | body | formdata | files ) ('deeper access control' |( ( 'policy' | isLogined | isOwner | isAdmin | '...' ) ( 'fallbacks'))) ('data control' | pagination | filter | cache | i18n) ('error processing' | http | application | database | business )  ( 'bussiness logic' | ( 'command' process ) | ('modelling' database )) ( 'ouput' | ( 'displayable' | html | xml )  ('api' | json | rest | graphql )  ('streaming' )  '...' ) 'Response'
```
