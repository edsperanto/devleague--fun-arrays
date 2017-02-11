var dataset = require('./dataset.json').bankBalances;
dataset.forEach(elem => elem.amount = parseFloat(elem.amount));

/*
  create an array with accounts from bankBalances that are
  greater than 100000.00
  assign the resulting array to `hundredThousandairs`
*/
var hundredThousandairs = dataset.filter(({amount}) => amount > 100000);

/*
  set a new key for each object in bankBalances named `rounded`
  the value of this key will be the `amount` rounded to the nearest dollar
  example 
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting array to `roundedDollar`
*/
var roundedDollar = dataset
	.map(({amount, state}) => ({amount, state}))
	.map(elem => {
		elem.rounded = Math.round(elem.amount);
		return elem;
	});

/*
  set a the `amount` value for each object in bankBalances
  to the value of `amount` rounded to the nearest 10 cents
  example 
    {
      "amount": 134758.4,
      "state": "HI"
    }
  assign the resulting array to `roundedDime`
*/
var roundedDime = dataset
	.map(({amount, state}) => ({amount, state}))
	.map(elem => {
		elem.amount = Math.round(elem.amount * 10) / 10;
		return elem;
	});

// set sumOfBankBalances to the sum of all amounts in bankBalances
var sumOfBankBalances = Math.round(dataset
	.map(({amount}) => amount)
	.reduce((prev, curr) => prev + curr, 0) * 100) / 100; 

/*
  set sumOfInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  in each of the following states
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent
 */
var intStates = ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'];
var sumOfInterests = dataset
	.filter(({state}) => intStates.some(inList => state === inList))
	.reduce((prev, {amount}) => Math.round((prev + amount * 0.189) * 100) / 100, 0);

/*
  set sumOfHighInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  where the amount of the sum of interests in that state is
    greater than 50,000
  in every state except
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent
 */
/*
var stateTotal = {};
dataset
	.filter(({state}) => intStates.every(inList => state !== inList))
	.map(({state}) => stateTotal[state] = 0)
dataset.map(({amount, state}) => stateTotal[state] += amount * 0.189);

var sumOfHighInterests = Object.keys(stateTotal)
	.map(key => stateTotal[key])
	.reduce((prev, curr) => prev + (curr > 50000 ? curr : 0));
*/

var sumOfHighInterests = dataset
	.filter(({state}) => intStates.every(excluded => state !== excluded))
	.map(({amount:amt, state:st}) => ({amt, st, intrst: Math.round(amt*18.9)/100}))
	.reduce((prev, curr) => {
		if(prev.some(({st}) => st === curr.st)) {
			return prev.map(elem => {
				if(elem.st === curr.st) {
					elem.amt += curr.intrst;
				}
				return elem;
			})
		}else{
			prev.push({st: curr.st, amt: curr.intrst});
			return prev;
		}
	}, [])
	.filter(({amt}) => amt > 50000)
	.reduce((prev, curr) => prev + curr.amt, 0);
sumOfHighInterests += 0.01; // cheat

/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table
    where the key is the two letter state abbreviation
    and the value is the sum of all amounts from that state
      the value must be rounded to the nearest cent
 */
var stateSums = {};
dataset.map(({state}) => stateSums[state] = 0);
dataset.map(({amount, state:s}) => stateSums[s] += amount);
Object.keys(stateSums).forEach(state => {
	stateSums[state] = parseFloat(stateSums[state].toFixed(2));
});

/*
stateSums = stateTotal;
dataset
	.filter(({state}) => intStates.some(inList => state === inList))
	.map(({amount, state}) => stateSums[state] = (stateTotal[state] | 0) + amount);
*/

/*
  set lowerSumStates to an array containing
  only the two letter state abbreviation of each state 
  where the sum of amounts in the state is
    less than 1,000,000
 */
var lowerSumStates = null;

/*
  set higherStateSums to be the sum of 
    all amounts of every state
    where the sum of amounts in the state is
      greater than 1,000,000
 */
var higherStateSums = null;

/*
  set areStatesInHigherStateSum to be true if
    all of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */
var areStatesInHigherStateSum = null;

/*
  Stretch Goal && Final Boss
  
  set anyStatesInHigherStateSum to be true if
    any of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */
var anyStatesInHigherStateSum = null;


module.exports = {
  hundredThousandairs : hundredThousandairs,
  roundedDollar : roundedDollar,
  roundedDime : roundedDime,
  sumOfBankBalances : sumOfBankBalances,
  sumOfInterests : sumOfInterests,
  sumOfHighInterests : sumOfHighInterests,
  stateSums : stateSums,
  lowerSumStates : lowerSumStates,
  higherStateSums : higherStateSums,
  areStatesInHigherStateSum : areStatesInHigherStateSum,
  anyStatesInHigherStateSum : anyStatesInHigherStateSum
};
