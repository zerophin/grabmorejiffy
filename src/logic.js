export function gen(size) {
  let packages = []
  let options = 'ABCDE'.split('')
  for (let i = 0; i < size; i++) {
    packages.push(options[Math.floor(Math.random() * 5)])
  }
  return packages
}

export const steps = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4
}

export const getSteps = (from, to) => {
  let fromSteps = steps[from];
  let toSteps = steps[to];
  let answer = Math.abs(fromSteps - toSteps);

  return answer;
}

export const getLongSteps = (to) => {
  let toSteps = steps[to];
  return toSteps * 2;
}

export function splitInto(arr, size = 3) {
  arr = arr.slice();
  if (size <= 0) size++;

  let newArr = [];
  for (let i = 0; i < arr.length; i += size) {
    let newSlice = arr.slice(i, i + size)
    newArr.push(newSlice);
  }
  return newArr;
}

export function getTotalStepsOldWay(arr) {
  // arr = arr.slice();
  // return arr.reduce((curr, next) => {
  //   return curr += getLongSteps(next);
  // }, 0)
  return newWay(arr, 1);
}

export function getTotalSteps(arr) {
  arr = arr.slice();
  let steps = 0;


  arr.forEach(el => {
    steps += el.reduce((curr, next, i, arr) => {
      let from = arr[i - 1];

      if (from === undefined) return curr += 0;

      return curr += getSteps(from, next)
    }, 0)
  })
  return steps;
}

export function getTotalStepsSorted(arr) {
  arr = arr.slice();
  let newArr = arr.map(stack => stack.sort((a, b) => a < b ? -1 : 1))
  return getTotalSteps(newArr);
}

export function getReturnSteps(arr) {
  arr = arr.slice();
  // check for length of 1 TODO
  let firstPos = arr.map(stack => stack[0]);
  let lastPos = arr.map(stack => stack[stack.length - 1]);
  let steps = 0;

  for (let i = 0; i < firstPos.length; i++) {
    let goingTo = getSteps('A', firstPos[i])
    let goingBack = getSteps(lastPos[i], 'A');
    steps += goingTo + goingBack;
  }

  return steps;
}

export function newWay(packages, split) {
  packages = packages.slice();
  let splitPackages = splitInto(packages, split)

  let totalSteps = getTotalSteps(splitPackages);
  let returnSteps = getReturnSteps(splitPackages);
  let completeSteps = totalSteps + returnSteps;
  return completeSteps;
}

export function newWaySorted(packages, split) {
  packages = packages.slice();
  let splitPackages = splitInto(packages, split)
  let totalSteps = getTotalStepsSorted(splitPackages)
  let returnSteps = getReturnSteps(splitPackages);
  let completeSteps = totalSteps + returnSteps;
  return completeSteps;
}

export const time = {
  'step': 1,
  'identify': 1.5,
  'stow': 4,
  'cart': 2,
}
// console.log("new way", newWay(packages))
//
// console.log('~'.repeat(10));
//
// let oldWay = getTotalStepsOldWay(packages);
// console.log({oldWay})
// console.log(getTime(packages, oldWay))
//
// console.log('~'.repeat(10));
// console.log('with sorting');
// console.log(newWaySorted(packages, 2));
// console.log(getTime(packages, newWaySorted(packages, 2), true))
//
// console.log('~'.repeat(10));

export function getTime(packages, steps, cart) {
  let stepTime = steps * time["step"];
  let identifyTime = packages.length * time['identify'];
  let stowTime = packages.length * time['stow'];
  if (cart) {
    stepTime += packages.length * time['cart'];
  }
  let totalTime = stepTime + identifyTime + stowTime;
  return {totalTime, stowTime, identifyTime, stepTime}
}

export function getPercent(num1, num2) {
  let ratio = num1 / num2;
  if (ratio < 1) {
    return -(1 - ratio).toFixed(2) * 100;
  }
  return ((ratio % 1) * 100).toFixed(2);
}

export function generateAnimation(packages, splitSize = 1, time) {
  let animation = []
  let defaultPosition = {position: 'A', isDefault: true}
  // animation.push(defaultPosition)

  let splitPackages = splitInto(packages, splitSize);
  splitPackages.forEach((stack) => {
    let prevPosition = animation.at(-1)?.position ?? 'A';
    animation.push({...defaultPosition, stepsTo: getSteps(prevPosition, 'A') * 1000})
    stack.forEach((letter, i, arr) => {
      let stepsTo = 0;
      if (arr[i - 1]) {
        stepsTo = getSteps(arr[i - 1], letter);
        stepsTo *= time['step'] * 1000;
      } else {
        stepsTo = getSteps('A', letter);
        stepsTo *= time['step'] * 1000;
      }
      let newObj = {
        position: letter,
        stepsTo,
        delay: 3,
      };
      animation.push(newObj);
    })
  })
  return animation;
}


//
// let oldWayTime = newWay(packages, 0);
// let oldTime = getTime(packages, oldWayTime)
// for (let i = 0; i < 20; i++) {
//   let steps = newWay(packages, i);
//   let timed = getTime(packages, steps, true);
//   console.log(`total time ${i}`, timed)
//   console.log(`${getPercent(oldTime, timed)}% difference`)
// }
