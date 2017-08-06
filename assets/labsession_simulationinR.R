#####################################################
#####################################################
## Simulation in R
## Lab Script 
## Zurich Summer School for Women in Political Methodology
## 7. August 2017
#####################################################
#####################################################

# Today:
# 1.   Prediction withouth uncertainty
# 2.   Simulating Parameters
# 3.   Expected Values E[Y|X] and First Difference 
# 4.   Expected Values E[Y|X] over a range of X
# 5.   Exercise: Application to count model

# Goals for Today:
# - use simulation to make statements about uncertainty of predicted/expected values
# - calculate quantities of interest

# Notes
# We will work with Data from the Fearon an Lattin 2003 Article
  rm(list=ls())

# Required Packages
  require(MASS) # for multinomial normal
  require(foreign) # to read in stata files
  require(ggplot2) # Ggplot for graphs
  require(texreg)  # For regression tables

# Set seed
  set.seed(9675)

###################################################
## 1. Review: Prediction So Far
###################################################

  dat_fearon <- read.dta(file="fearon_rep.dta")

# Replicate Model 1 
# Table 1 Fearon and Lattin 2003
  m1 <- glm(civilwar ~ priorwar + gdp_lagged + log_population + log_mountain + noncontiguous
            + oil + newstate + instability + democracy1 + ethnicfrac + relifrac
            , data=dat_fearon, family=binomial(link=logit))
  
  
  screenreg(m1) # Regressiontable output

# 1. Get Coefficients
  beta <- coef(m1)

# 2. Choose Interesting Covariates

  # Case x1 with low mountain terrain
  head(m1$model[,-1]) # Gives Covariate matrix used fpor estimation
  x1  <- c(1,apply(m1$model[,-1],2,mean)) # One is for the intercept
  x1["log_mountain"] <- quantile(m1$model$log_mountain,c(0.1))

  # Case x2 with high mountain terrain
  x2  <- c(1,apply(m1$model[,-1],2,mean)) # One is for the intercept
  x2["log_mountain"] <- quantile(m1$model$log_mountain,c(0.9))
  


# 3. Our predict-function for logit model
  
  ivlogit <- function(x) exp(x)/(1 + exp(x))
  
  predict.pi <- function(beta, x){
    
    eta <- beta%*%x # linear predictor
    mu <- ivlogit(eta) # response function
    
    return(mu)
    
  }

  p1 <- predict.pi(beta, x1)
  p2 <- predict.pi(beta, x2)

# 4. Plot

  # Bind results to data.frame  
  df <- data.frame("mountain_terrain"=c("low","high"),"pred"=c(p1,p2))
  
  ggplot() +  ## Start ggplot engine
    geom_point(data=df,aes(x=mountain_terrain, y=pred)) + ## Add Points with predicted Values
    ylab("Predicted Probability of a Civil War") + ## Label Y-axis
    ylim(c(0,0.1)) +  ## Set Limits for y-axis
    theme_minimal() ## Make it look a bit nicer, more in (Denise's Wokshop) 

  
# What is missing?

###################################################
# Exercise I: 
# Get predicted values for newstates and oldstates
# from the probit version of the model
# with all other coavariates set to their median

m1_probit <- glm(civilwar ~ priorwar + gdp_lagged + log_population + log_mountain + noncontiguous
            + oil + newstate + instability + democracy1 + ethnicfrac + relifrac
            , data=dat_fearon, family=binomial(link=probit))
  

  
###################################################
## 2. Simulating Parameters
###################################################


# Steps for Simulating Parameters (Estimation Uncertainty)
# 1. Get the coefficients from the regression (gamma.hat)
# 2. Get the variance-covariance matrix (V.hat)
# 3. Set up a multivariate normal distribution N(gamma.hat,V.hat)
# 4. Draw from the distribution nsim times


# 1. Get the coefficients from the regression (gamma.hat)
gamma.hat <- coef(m1)

# 2. Get the variance-covariance matrix (V.hat)
V.hat <- vcov(m1) # What are the diagonal elements?
sqrt(diag(V.hat))

# 3./4. et up a multivariate normal distribution N(gamma.hat,V.hat)
nsim <- 10000
S <- mvrnorm(nsim,gamma.hat,V.hat)

dim(S) # Check dimensions


###################################################
## 3. Expected Values E[Y|X] AND First Difference 
###################################################

# Steps to Generate Expected Values E[Y|X]
# 1. Decide on interesting covariates, X.c
# 2. Take simulated effect coefficients to
# 3. Compute E[Y|X] = mu as the systematic component
#  Remark:  This is a short cut 
#           In the King et al. piece there is a step in between,
#           where the expectation is also simulated.
#           But as we know the analytical expectation we work with that
# 4. Get QI: Transform, quantiles, plot, etc.

# 1. Difference in predicted probability for low-mountain and high-mountain 
  x1  <- c(1,apply(m1$model[,-1],2,mean)) # One is for the intercept
  x1["log_mountain"] <- quantile(m1$model$log_mountain,c(0.1))
  x2  <- c(1,apply(m1$model[,-1],2,mean)) # One is for the intercept
  x2["log_mountain"] <- quantile(m1$model$log_mountain,c(0.9))


# 2./3.
  eta_x1 <- S %*% as.matrix(x1)
  eta_x2 <- S %*% as.matrix(x2)

  pi_x1 <- ivlogit(eta_x1) 
  pi_x2 <- ivlogit(eta_x2) 

# Even easier
  X.c <- as.matrix(rbind(x1,x2))
  pi.c <- ivlogit(S %*% t(X.c))

# 4. QI around expected value 
 
  # Create Data Frame with quantiles
  df <- data.frame(
          t(apply(pi.c,2,quantile,c(0.99,0.975,0.5,0.025,0.01)))
  )
  colnames(df) <- c("high","high2","mid","low2","low")
  
  # Add mountain 
  df$mountain <- c("low (10% Quantile)","high (90% Quantile)")

  # Plot
  ggplot() +  ## Start ggplot engine
    geom_pointrange(data=df,aes(x=mountain, y=mid,ymin=low,ymax=high)) + ## Add Points with predicted Values
    ylab("Predicted Probability of a Civil War") + ## Label Y-axis
    ylim(c(0,0.25)) +  ## Set Limits for y-axis
    theme_minimal() ## Make it look a bit nicer, more in (Denise's Wokshop) 
  
  
# 4. First Differences
  # FD = E(Y|X.c1) - E(Y|X.c2)
  fd <- data.frame("fd"=apply(pi.c,1,diff))

  # GGplot
  ggplot() +
    geom_density(data=fd,aes(fd),fill="black") +
    theme_minimal() +
    xlab("First Difference Mountain terrain high - Mountain terrain low")


###################################################
# Exercise II: 
# Get first difference for newstates versus oldstates
# from the probit version of the model
# with all other coavariates set to their median
  
m1_probit <- glm(civilwar ~ priorwar + gdp_lagged + log_population + log_mountain + noncontiguous
                   + oil + newstate + instability + democracy1 + ethnicfrac + relifrac
                   , data=dat_fearon, family=binomial(link=probit))
  

###################################################
## 4. Expected Values E[Y|X] over a range of X 
###################################################
  
  # More exciting
  # Let's calculate expected values over a range of log_mountain terrain
    
  # Set range of covariate
  cov_vary <- "log_mountain"
  cov_minmax <- quantile(m1$model[,cov_vary],probs = c(0,1)) 
  cov_seq <- seq(log(0.00001),log(100),length.out = 1000)
  
  # Set Covariate Matrix
  X <- c(1,apply(m1$model[,-1],2,median))
  col_names <- names(X)
  sel_cov <- which(col_names==cov_vary)
  X <- matrix(X,nrow=length(cov_seq),ncol=length(X),byrow = T)
  X[,sel_cov] <- cov_seq
  
  # Simulate predicted probabilities
  p <- ivlogit(S %*% t(X))

  # Convert to Data.frame
  res <- t(apply(p,2,quantile,c(0.01,0.025,0.5,0.975,0.99)))
  df <- data.frame(res)
  names(df) <- c("low1","low2","mid","high2","high1")
  df$seq <- cov_seq
  
  # Ggplot2
  ggplot() + 
    geom_line(data=df,aes(x=exp(seq),y=mid)) + 
    geom_ribbon(data=df,aes(x=exp(seq),ymin=low1,ymax=high1),alpha=0.1) + 
    geom_ribbon(data=df,aes(x=exp(seq),ymin=low2,ymax=high2),alpha=0.4) + 
    theme_minimal() + 
    ylab("Probability of Civil War") + 
    xlab("% Mountain Terrain in a Country") +
    ylim(c=c(0,0.1)) +
    geom_rug(data=m1$model, aes(x=exp(log_mountain)),alpha=0.4)
  
###################################################
# Exercise III: 
# Study the effect gdp_lagged over the range of values 
# in new, oil states no prior war, all other covariates at their median.
  
  m1_probit <- glm(civilwar ~ priorwar + gdp_lagged + log_population + log_mountain + noncontiguous
                   + oil + newstate + instability + democracy1 + ethnicfrac + relifrac
                   , data=dat_fearon, family=binomial(link=probit))
  






