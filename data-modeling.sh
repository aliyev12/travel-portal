 #!/bin/bash
 
# Black        0;30     Dark Gray     1;30
# Red          0;31     Light Red     1;31
# Green        0;32     Light Green   1;32
# Brown/Orange 0;33     Yellow        1;33
# Blue         0;34     Light Blue    1;34
# Purple       0;35     Light Purple  1;35
# Cyan         0;36     Light Cyan    1;36
# Light Gray   0;37     White         1;37


R='\033[1;31m';
G='\033[1;32m';
B='\033[1;34m';
N='\033[0m' # No Color
printf "\n";
printf " === ${R}DATA MODELING WITH ${G}MONGO DB${N} ===\n";
printf " --------------------------------------------------------------------------------------------|\n";
printf " | ${B}Relationships:${N}|                                                                           |\n";
printf " |---------------|---------------------------------------------------------------------------|\n";
printf " |      ${B}1:1${N}      | movie -> name    (1 movie can only have 1 name)                           |\n";
printf " |---------------|---------------------------------------------------------------------------|\n";
printf " |               | 1:FEW                  | 1:MANY                  | 1:TON                  |\n";
printf " |               |------------------------|-------------------------|------------------------|\n";
printf " |               |                        |                         |                        |\n";
printf " |               |          ( award 1     |          ( review 1     |          ( log 1       |\n"; 
printf " |    ${B}1:MANY${N}     | movie -> ( award 2     |          ( review 2     |          ( log 2       |\n";
printf " |               |          ( award 3     | movie -> ( review 3     | movie -> ( log 3       |\n";
printf " |               |                        |          ( ... * 1000   |          ( ... * 1mil+ |\n";
printf " |               |                        |          ( review 3     |          ( log 3       |\n";
printf " |               | 1 movie can win many   |                         |                        |\n";
printf " |               | awards                 |                         |                        |\n";
printf " |---------------|---------------------------------------------------------------------------|\n";
printf " |               | movie 1  -> <-  actor 1                                                   |\n"; 
printf " |    ${B}1:MANY${N}     | movie 2  -> <-  actor 2                                                   |\n";
printf " |               | movie 3  -> <-  actor 3                                                   |\n";
printf " |-------------------------------------------------------------------------------------------|\n";
printf "\n";
printf "\n";

# printf " === ${G}REFERENCING VS. EMBEDDING${N} ===\n";
# printf "|--------------------------------------------------------------------------------------------|\n";
# printf "| REFERENCED / NORMALIZED                EMBEDDED / DENORMALIZED:                           |\n";
# printf "|--------------------------------------------------------------------------------------------|\n";
# printf "| movie = {
# |  _id: ObjectID('222'),
# |  actors: [
# |    ObjectID('555')
# |  ]
# | }
# |
# | actor = {
# |   _id: ObjectID('555'),
# |   name: Brad Pitt
# | }
# .
# cscscs
# ";
