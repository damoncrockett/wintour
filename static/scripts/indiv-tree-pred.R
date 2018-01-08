setwd("~/Desktop/")
df = read.csv("indiv_tree_pred_binned_grouped.csv")
df$idx = c(1:nrow(df))
df$idx = as.character(df$idx)
library(ggplot2)
library(reshape2)

df.melt = melt(df,id.vars=c('idx'))

ggplot(df.melt,aes(variable,value,group=idx)) +
  geom_line(alpha=0.01)
