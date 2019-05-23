#' ---
#' title: "Workshop IRT in Political Science"
#' subtitle: "Application IRT Roll Call Votes"
#' author: "Lukas F. Stoetzer"
#' date: "23 March 2019"
#' ---

#' The script analysis roll call votes in the 109th US Senate
#' Using IRT models using emIRT and ideal
#' W ewill focus on 1-Dimensional Model in class

## Prepare ========

  # Load Libraries
    library(tidyverse)
    library(foreign)
    library(emIRT) # For EM-Algorithm
    library(pscl) # For Gibbs-Sampler

  # Load Data Set
    data(s109)  # Part of the package

  # Convert to roll call object (used by both emIRT and ideal)
    rc <- convertRC(s109)
      
## Estimate Model using emIRT ========
    
    # Create priors and starting values
    p <- makePriors(rc$n, rc$m, 1)
    s <- getStarts(rc$n, rc$m, 1)
    
    # Estimate models using binIRT
    lout <- binIRT(.rc = rc, # Roll call votes 
                   .starts = s, # Starting values
                   .priors = p, # Prior distributions
                   .control = { # Some additional controls 
                     list(threads = 1,
                          verbose = FALSE,
                          thresh = 1e-6
                     )
                   })
    
    # Data.frame for Plot with Ideal Points
    df <- data.frame("ideal.point"=lout$means$x[,1],
                     "legislator" = rownames(lout$means$x),
                     "party" = rc$legis.data$party)
    
    # Plot with Ideal Points
    ggplot(df) + 
      geom_point(aes(y=reorder(legislator,ideal.point),
                     x=ideal.point, col=party)) +
      theme_minimal() + 
      xlab("Legislatur Ideal Point") + 
      ylab("")
      
## Estimate Model using ideal ========
     
    # Use ideal to estimate the model 
    # This will take some time (for me it took 7 minutes)
    # you can use the emIRT estimates as starting points
   
    start.time <- Sys.time()
    id1 <- ideal(rc, # Roll call vote as input 
                 d=1, # One dimension
                 startvals=list(x=as.numeric(lout$means$x[,1])), # Starting values from emIRT estiamtes
                 normalize=TRUE, # Should ideal.points be standard normal, locally identifies the model
                 store.item=FALSE, # Should Item Discimination paramter be stored
                 maxiter=100000, # Needs large number of iteration to converge
                 burnin=5000, # Discard the first iterations
                 thin=50 # Only save every 50's draw from the posterori distribution
                 )  
    end.time <- Sys.time()
    runtime <- end.time - start.time
    
    # Make a Plot with Ideal Points
    plot(id1, showAllNames=T)
    
    # Traceplot to check convergence
    tracex(id1,legis="KENNEDY")

    