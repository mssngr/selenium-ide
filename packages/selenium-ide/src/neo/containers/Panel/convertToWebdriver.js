export default json => {
  let webdriverCode = ``
  try {
    for (let step of json.tests[0].commands) {
      switch (step.command) {
        case 'open':
          webdriverCode += command_open(json, step)
          break
        case 'setWindowSize':
          webdriverCode += command_setWindowSize(json, step)
          break
        case 'click':
          webdriverCode += command_click(json, step)
          break
        case 'type':
          webdriverCode += command_type(json, step)
          break
        case 'sendKeys':
          webdriverCode += command_sendKeys(json, step)
          break
        default:
          webdriverCode += command_default(json, step)
          break
      }
      webdriverCode += `\n`
    }
  } catch (error) {
    webdriverCode += `\n`
    webdriverCode = +`Error parsing script \n`
    webdriverCode = +`${error} \n`
  }

  return webdriverCode
}

function convertKey(key) {
  switch (key) {
    case '${KEY_ENTER}':
      return `"\\uE007"`
    default:
      return 'NONE FOUND'
  }
}

function getSelector(target) {
  if (target.includes('id='))
    return `await client.$('#${target.split('id=')[1]}')`
  else if (target.includes('name='))
    return `await client.$(function() { return this.document.getElementsByName('${
      target.split('name=')[1]
    }')[0];})`
  else if (target.includes('css='))
    return `await client.$('${target.split('ss=')[1]}')`
  else return `await client.$('${target}')`
}

function command_sendKeys(_, step) {
  let varName = `Variable${step.id.split('-').join('')}`
  return `
const ${varName} = ${getSelector(step.target)}
await ${varName}.waitForDisplayed(10000)
await ${varName}.keys(${convertKey(step.value)})
    `
}

function command_type(_, step) {
  let varName = `Variable${step.id.split('-').join('')}`
  return `
const ${varName} = ${getSelector(step.target)}
await ${varName}.waitForDisplayed(10000)
await ${varName}.setValue('${step.value}')
    `
}

function command_click(_, step) {
  let varName = `Variable${step.id.split('-').join('')}`
  return `
const ${varName} = ${getSelector(step.target)}
await ${varName}.waitForDisplayed(10000)
await ${varName}.click()
    `
}

function command_setWindowSize(_, step) {
  let targetSplit = step.target.split('x')
  return `//await client.setWindowSize(${targetSplit[0]},${targetSplit[1]})`
}

function command_open(json) {
  return `await client.url("${json.url}")`
}

function command_default(_, step) {
  return `//Did not create code for ${step.command} \n //Target: ${
    step.target
  } \n //Value: ${step.value}`
}
