The following files are relevant to the Wiser, Ribeck, and Lenski 2013 paper:

Final.Dryad.Script.txt - the analysis script for all empirical data written for R.  Copy and paste it into an R terminal
			after adjusting the directory path to where you saved the files.
Concatenated.LTEE.data.all.csv - the raw data for competitions against the ancestor
Concatenated.40k.v.50k.csv - the raw data for competitions against a 40k clone
adaptation model_diminishing returns_continuous_notated.nb - the Mathematica notebook for the theoretical work
adaptation model_diminishing returns_continuous_notated.pdf - a pdf of the Mathematical notebook, 
								readable by those without Mathematica installed



The data files have the following data:

Concatenated.LTEE.data.all.csv:

Generation is which generation the evolved population is from.
Red.Pop is which population the red colonies are from -- either REL 606 or one of the Ara - populations.
White.Pop is which population the white colonies are from -- either REL 607 or one of the Ara + populations.
Rep is which replicate within a given population the competitions are from.
Red.0 is the count of red colonies on the plate for the start of the competition.
White.0 is the count of white colonies on the plate for the start of the competition.
D.0 is the dilution factor for the start of the competition.  D.0 * Red.0 is therefore the measured number of red cells at the start of the competition.
Red.1 is the count of red colonies on the plate after 1 day of the competition.
White.1 is the count of white colonies on the plate after 1 day of the competition.
D.1 is the dilution factor after 1 day of the competition.
Fitness is the measured fitness of the population; w = ln (Af/Ai)  / ln (Bf/Bi) where A is the evolved population size, B is the ancestral population size, f is the final time point (day 1), and i is the initial time point.
Complete is a Yes/No column about whether there are values through 50000 generations for that population.
Mutator.Ever is a Yes/No column about whether the population became a hypermutator within the first 50000 generations of the LTEE.

Concatenated.40k.v.50k.csv:

Red.Pop is which population the red colonies are from -- either REL 10948 or one of the Ara - populations.
White.Pop is which population the white colonies are from -- either REL 11638 or one of the Ara + populations
Population is which population's fitness is being calculated.
Marker is whether that popultion is Ara + or Ara -
Generation is which generation the measured population is from.
Rep is which replicate the competition is from.
Red.0 is the count of the red colonies on the plate for the start of the competition.
White.0 is the count of the pink colonies on the plate for the start of the competition.
D.0 is the dilution factor for the start of the competition.  D.0 * Red.0 is therefore the measured number of red cells at the start of the competition.
Red.3 is the count of the red colonies on the plate from the sample at day 3 of the competition.
White.3 is the count of the white colonies on the plate from the sample at day 3 of the competition.
D.3 is the dilution factor for day 3 of the competition.
Fitness.3 is the measured fitness of the population;  w = ln (Af/Ai)  / ln (Bf/Bi) where A is the evolved population size, B is the ancestral population size, f is the final time point (day 1), and i is the initial time point.


