#!/usr/bin/env node

import { print } from 'gluegun'
import { getPlatform, OS } from './getPlatform'
import { install } from './installer'

const isWindows = process.platform === 'win32'

print.info('⭐️ Welcome to remotify local installer ⭐️')
print.info(
  '❗ This will install the relevant tools needed to run remotify on your local system ❗'
)

const platform = getPlatform()

print.info(`First I'm going to check your operating system ... ${platform}`)

if (platform === OS.unknown) throw new Error('unsupported OS')

install(platform)
