---
title: "Why diversification works: Markowitz in plain words"
description: "Two assets, one formula, and why the correlation between them matters more than most investors think."
topic: research
math: true
---

In 1952 Harry Markowitz published a short paper, *Portfolio Selection*, in the *Journal of Finance*. Its central idea now sounds obvious: judge an investment by what it does to your whole portfolio, not on its own. That idea became modern portfolio theory, and it earned Markowitz a share of the 1990 Nobel memorial prize in economics.

## Risk does not simply add up

Take two assets with returns that vary by $$\sigma_1$$ and $$\sigma_2$$ (their standard deviations, our usual measure of risk). Put a fraction $$w_1$$ of your money in the first and $$w_2$$ in the second. The variance of the portfolio is

$$
\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2\,w_1 w_2\,\rho\,\sigma_1\sigma_2
$$

The last term is where the magic is. $$\rho$$ is the correlation between the two assets, a number between −1 and +1. The lower it is, the more the ups of one asset cancel the downs of the other.

## A worked example

Suppose both assets have a risk of 20% a year and you split your money 50:50. Only the correlation changes:

| Correlation ($$\rho$$) | Portfolio risk |
|-----------------------:|---------------:|
| +1.0                   | 20.0%          |
| +0.3                   | 16.1%          |
| 0.0                    | 14.1%          |
| −1.0                   | 0.0%           |

With perfect correlation, holding two assets is no better than holding one. With a correlation of 0.3, which is ordinary for two stocks from different sectors, risk falls by about a fifth. And if the expected returns of the two assets are similar, you have lowered risk without giving up return. That is why diversification is often called the closest thing to a free lunch in finance.

## The efficient frontier

Repeat this for many assets and every possible mix, and you can find the portfolios that give the highest expected return for each level of risk. Plotted on a chart, they trace a curve called the **efficient frontier**. Any portfolio below the curve is leaving something on the table: another mix offers more return for the same risk.

## Where it gets hard in practice

The theory is elegant; the inputs are not.

- **Expected returns are hard to estimate.** Small errors in the inputs can produce extreme, concentrated portfolios. The optimiser tends to bet most on the assets whose returns were overestimated.
- **Correlations change.** In a market crash, assets that usually move independently often fall together, just when diversification is needed most.
- **Real portfolios have rules.** Investors face limits on weights, transaction costs, minimum lot sizes and regulations.

Much of today's research, including work drawing on operations research, tries to handle exactly these problems: adding constraints, shrinking noisy estimates, and building portfolios that stay sensible when the inputs are wrong. I'll cover some of these methods in future research notes.

## Further reading

Markowitz, H. (1952). Portfolio Selection. *The Journal of Finance*, 7(1), 77–91.
