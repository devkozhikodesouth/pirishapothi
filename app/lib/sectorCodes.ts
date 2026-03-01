export const sectorCodes: Record<string, string> = {
  Kizhakkoth: "kz81kp",
  Avilora: "av44jh",
  Poonoor: "pn92qd",
  Elettil: "el67mx",
  Kanthapuram: "kn55rt",
  Kattippara: "kt38lp",
  Thalayad: "th74zx",
  Unnikulam: "un19bc",
  Panagad: "pg63qw",
  Balussery: "bl48mn",
  Kolikkal: "kl26vd",
};

export const getSectorNameByCode = (code: string) => {
  return Object.keys(sectorCodes).find((key) => sectorCodes[key] === code);
};
