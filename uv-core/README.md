# Urbit Visor Core

An easy to use library which exposes the core functionality of [Urbit Visor](https://urbitvisor.com). 

`uv-core` implements a generalized API and messaging implementation that can be used by both Urbit Web Apps and UV Extensions. The Urbit Visor extension ID is hardcoded into the library and automatically configured to be used when the API is called. This means that interacting with Visor is as simple as installing `uv-core`, importing `urbitVisor`, and using the methods to interact with Visor directly.

The interface was unified together for both Urbit Web Apps as well as UV Extensions (thus resulting in `uv-core`) so that everything built on top can be easily utilized for both use cases. The upcoming library `uv-components` (that will hold reusable components that devs can use in their own projects), takes advantage of this fact to allow a component to be created once, and be used in a web page or in a web extension without having to configure or edit anything. This functionality required redesigning the messaging scheme from the ground up (including removing injecting the `urbitVisor` API into every page) in order to allow this seamless and composable experience to be possible for devs.

Thanks to this, any open source projects which use Urbit Visor going forward will be easy to fork and borrow code from no matter in what form it was shipped in, thus strengthening the foundation of the upcoming Urbit Visor ecosystem.

## Getting Started

`uv-core` is available on [NPM](https://www.npmjs.com/package/@dcspark/uv-core).

Add it to your node application:
`npm i @dcspark/uv-core`
