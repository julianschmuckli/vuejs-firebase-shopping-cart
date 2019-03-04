# M150
This fork is for a project for the Module 150 at BBB IT-School in Baden.

Following features has been added in this fork:
* Setting a delivery address
* Redeem a coupon code
* Give feedback to the vendor

## Demo
If you want to see a demo, checkout the following link:
https://bbbaden-m150.firebaseapp.com/

## Get Started

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

Or use `yarn`
``` bash
yarn install
yarn dev
```

## Example data
In the `data` folder you will find some JSON files, which can be imported in the Realtime Database in Firebase. Just create a node `products` and `coupons` and import the JSON files in there.

## Features

This project implements basic shopping cart features:
* Login / Register
* Pull products list from API
* Add/Remove item to shopping cart

## Technical details

* VueJS [^2.2.1]
* Firebase (auth and realtime database)

## Contributing

As I use this for my own projects, I know this might not be the perfect approach
for all the projects out there. If you have any ideas, just
[open an issue][issues] and tell me what you think.

If you'd like to contribute, please fork the repository and make changes as
you'd like. Pull requests are warmly welcome.
