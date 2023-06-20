const a = {
  b: 1,
  c: 2
}

const d = {...a, e: 3}

const {b,c,...f} = d
