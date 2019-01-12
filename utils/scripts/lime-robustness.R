library(ggplot2)
setwd("~/Desktop/DSAPP/")
df = read.csv("lime-robustness-all-score-outcome.csv")
d = read.csv("32092_2014-04-11_subset.csv")

ggplot(df,aes(nft,nunq,size=nsmp)) + 
  geom_jitter(shape=1) +
  scale_size_continuous(range=c(1,6)) +
  facet_wrap(~id) +
  theme(
    text = element_text(size=10)
    )

ggplot(df,
       aes(as.factor(nsmp),
           nunq,
           group=as.factor(id)
           )
       ) +
  geom_line(size=3,alpha=0.125) +
  facet_wrap(~nft) +
  theme(
    legend.position = "none",
    text = element_text(size=25),
    axis.text = element_text(size=20)) +
  labs(x='Size of Local Sample',
       y='Number of Unique Features Across 10 Iterations',
       title='Size of Feature Bank as a Function of Sample Size For 2,5,7,11,13, and 17 Feature Models')




ggplot(df,
       aes(as.factor(nsmp),
           nunq,
           group=as.factor(nft),
           color=as.factor(nft)
       )
) +
  geom_line(size=2,alpha=0.5) +
  facet_wrap(~officer_id_sorted) +
  theme(
    legend.position = "none",
    text = element_text(size=25),
    axis.text.y = element_text(size=20),
    axis.text.x = element_text(size=10)) +
  labs(x='Size of Local Sample',
       y='Number of Unique Features Across 10 Iterations',
       title='Size of Feature Bank as a Function of Sample Size For 66 Officers, Sorted (LRTB;asc) by Risk Score')

ggplot(df,
       aes(as.factor(nsmp),
           nunq,
           group=id
       )
) +
  geom_line(size=5,alpha=0.25) +
  facet_wrap(~id + nft,
             nrow = 17,
             ncol = 6) +
  theme(
    text = element_text(size=50)
  )


chosen_officers = unique(df$officer_id)


DIR = "/Users/damoncrockett/Desktop/chop-new/"
for (i in chosen_officers) {
  tmp = df[df$officer_id==i,]
  ggplot(tmp,
         aes(as.factor(nsmp),
             nunq,
             group=as.factor(nft),
             color=as.factor(nft)
         )
  ) +
    geom_line(size=2) +
    theme(
      legend.position = "none",
      text = element_blank(),
      axis.ticks = element_blank(),
      panel.background = element_rect(fill="black"),
      panel.grid.minor = element_line(color="black"),
      panel.grid.major = element_line(color="black"),
      plot.background = element_rect(fill="black",color=NA))
  ggsave(paste0(DIR,as.character(i),".png"),
         width = 1,
         height = 1,
         units = "in")
}




# freq
library(ggrepel)
tmp = read.csv("freq.csv")

ggplot(tmp,aes(frequency,overall_freq,label=record_type)) +
  geom_text_repel(size=15) +
  labs(x="Frequency in LIME models",y="Frequency in Police Data") +
  theme(
    text = element_text(size=30))  

