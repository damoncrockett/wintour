setwd("~/Desktop/tmpwintour/")
df = read.csv("170728_2015-01-01_interactions_topfeat_ocnd.csv")
library(ggplot2)


ggplot(subset(df,df$grpratio < 51),aes(demog0dist,
              color=grpratio,
              demog1dist)) +
  geom_point(size=1) +
  guides(color = guide_legend(override.aes = list(size=7)))

ggplot(subset(df,df$grpratio < 51),aes(demog0dist,
                                       color=demog_feat,
                                       demog1dist)) +
  geom_point(size=1) +
  guides(color = guide_legend(override.aes = list(size=7)))

library(ggrepel)

ggplot(subset(df,df$grpratio < 51),aes(demog0dist,
                                       #color=top,
                                       demog1dist)) +
  geom_point(size=1,color='lightgrey') +
  guides(color = guide_legend(override.aes = list(size=7))) +
  geom_point(data=subset(df,df$top=='True'),
             aes(demog0dist,demog1dist,color=feature_importance))
  #scale_color_manual(values=c('lightblue','orange')) +

str(df)

feat = "ocnd_id_dummyofficereducation_four_year_degree_max"

ggplot(subset(df,df$top=='True' & df$demog_feat==feat),
       aes(demog0dist,feature_importance,
           label=main_feat)) +
  geom_point()


df.pn = read.csv("170728_2015-01-01_interactions_topfeat_ocnd_probnorm.csv")

ggplot(df.pn,aes(featdist,demog1dist)) +
  geom_point(size=1,alpha=0.5) +
  guides(color = guide_legend(override.aes = list(size=7)))



