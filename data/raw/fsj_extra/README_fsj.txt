Data and code for "Allele frequency dynamics in a pedigreed natural population"
by N Chen, I Juric, EJ Cosgrove, R Bowman, JW Fitzpatrick, SJ Schoech, AG Clark, G Coop.

These data were extracted from the Florida Scrub-Jay demographic database in 2016. If you plan on using these data, please contact nancy.chen@rochester.edu, RBowman@archbold-station.org, and jwf7@cornell.edu. We ask that you contact us to ensure that (1) you get the most complete and up-to-date version of the data, (2) we can help walk you through the complexities of the data, and (3) you aren't planning on doing any analyses already underway.

=====
Description of the various files:

DATA:
FSJpedgeno2018.ped: space-delimited file with pedigree and genotypes in PLINK ped format. Columns are:
-Family ID
-Individual ID
-Father
-Mother
-Sex: 1 = male, 2 = female, 0 = unknown
-Phenotype: if no phenotypes, use '-9'
-Genotypes for each SNP, two columns per SNP. Alleles coded as 1/2. Missing genotypes denoted with 0.

SNPlist.txt: tab-delimited file listing SNPs and their chromosomes
-SNP: SNP ID
-Chr: chromosome assignment for that SNP. Unassigned SNPs are lumped into Chr Un

IndivData.txt: tab-delimited file containing information on birth and immigrant cohort as well as breeder designations
-Indiv: individual ID
-NatalYear: for individuals born at Archbold, the year individual was born
-CoreNestling: whether or not an individual was born in a core territory and therefore included in our genomic analyses
-ImmCohort: for immigrants, the year they first appeared
-InclBr: whether or not an individual bred in our population in 1990-2013 and was born before 2002 (and included in our fitness analyses)

IndivList.txt: tab-delimited input file listing individuals of each category over time for variance in allele frequency model
-Year: year of observation
-Indiv: individual ID
-Category: whether the individual was a "founder", "survivor", "immigrant", or "nestling" that year
-Genotyped: whether or not the individual was genotyped

CODE:
genedrop.zip: software for gene dropping simulations
-geneDrop_runner_final.py
-geneDrop_final_NC.c
-geneDropManual.txt

#Estimating genetic contributions
indivGenContribPipeline.sh: automated pipeline for using gene dropping to estimate genetic contributions of specific individuals (founders)

indivPed.r: R script to generate input files for individual genetic contribution simulations
-Input files: FSJpedgeno2018.ped, IndivData.txt
-Output files: 
	-IndivContrib_*.ped: pedigree files for each individual founder
	-allABSnestlings.txt: cohort file for all of Archbold

immGenContribPipeline.sh: automated pipeline for using gene dropping to estimate genetic contributions of immigrants

immPed.r: R script to generate input files for immigrant simulations
-Input files: FSJpedgeno2018.ped, IndivData.txt
-Output files: 
	-ImmContribYearly.ped: pedigree file for estimating contributions of immigrant cohorts
	-ImmContribAll.ped: pedigree file for estimating contributions of all immigrants
	-allABSnestlings.txt: cohort file for all of Archbold


#Testing for selection
genedropPipelineSelection.sh: automated pipeline for using gene dropping to test for selection

coreCohort.r: R script to generate cohort file in core territories
-Input file: IndivData.txt
-Output file: coreDemoNestlings.txt

split_ped.py: Python script to split a ped file into smaller files containing nLoci each
-Usage: python split_ped.py [pedfile] [nLoci]
-Input file: FSJpedgeno2018.ped
-Output files: ped_file.*.ped

analyzeSelOutput.r: R script to analyze results
-Input file: *data.txt & *sim.txt output files from gene dropping simulations
-Output file: genedropSelResults.rdata containing
	-pval_change: tests of selection in adjacent years
	-pval_1999to2013: test for net selection between 1999-2013


#Modeling variance in allele frequency change over time
alleleFreqModel_sample.R: script to calculate sample variances from actual data
-Input files: IndivList.txt, FSJpedgeno2018.ped
-Output files: 
	-indivlistgeno.rdata, 
	-modelIntermediateFiles.rdata: intermediate files
		-samplePars: number of individuals in each category each year
		-sampleFreq: sample allele frequencies for each category each year
	-sampleVar.rdata: variances from actual data

alleleFreqModel_sim.R: simulation script to estimate covariances and sampling error 
-Input files: IndivList.txt, FSJpedgeno2018.ped, indivlistgeno.rdata
-Output files:
	-simdataTrue.rdata: simulated genotypes
	-simAlleleFreq.rdata: simulated "true" allele frequencies for each category each year
	-simVar.rdata: simulated variances


