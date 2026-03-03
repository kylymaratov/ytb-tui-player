import { App } from './app'

const bootsrapp = async () => {
  try {
    const hanlder = new App()

    await hanlder.init()
  } catch (error) {
    throw error
  }
}

bootsrapp()
