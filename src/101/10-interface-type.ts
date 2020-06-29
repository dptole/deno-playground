/*
  Built-in types & Intersection types
*/

enum PasswordAlgorithm {
  MD5,
  BCRYPT,
}

type Email = [string, "@", string];

type Work = Omit<
  Company,
  "foundation_year" | "employees" | "subsidiary" | "parent" | "location"
>;

interface Company {
  company_name: string;
  foundation_year: number;
  location: Location[];
  employees: User[];
  subsidiary: Company[];
  parent: Company[];
}

interface Location {
  street: string;
  number?: number;
}

interface User {
  name: string;
  birthyear: number;
  works: Work[];
  location: Location[];
  children: User[];
}

interface User {
  seems_i_can_use_the_mixin_pattern_with_interfaces?: string;
}

type SocialMediaUser = Pick<User, "name" | "birthyear"> & {
  email: Email;
  password: Password;
  friends: SocialMediaUser[];
};

interface PasswordCrypto {
  algorithm: PasswordAlgorithm;
  gen(input: string): string;
  params: string[];
}

interface Password {
  crypto: PasswordCrypto;
  output: string;
}

/*
  Required and partial all at once
*/
type PasswordGenerationAlgorithm = Required<
  Partial<Record<PasswordAlgorithm, Partial<Required<Readonly<Password>>>>>
>;

function getPasswordGenerationAlgorithms(): PasswordGenerationAlgorithm {
  const pga = {} as PasswordGenerationAlgorithm;

  for (const pa in PasswordAlgorithm) {
    if (Number.isNaN(Number(PasswordAlgorithm[pa]))) {
      continue;
    }

    /*
      I have no idea why this is the only way to get this to work. The error
      message is similar to the ones we see in C or Haskell where you can only
      understand what went wrong if you built the language or works with it for
      more than a decade.

      The ideal code

          pga[PasswordAlgorithm[pa]] = getPasswordGenerationAlgorithm(PasswordAlgorithm[pa])

      The error message

          error: TS7053 [ERROR]: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Record<PasswordAlgorithm, Password>'.
            No index signature with a parameter of type 'string' was found on type 'Record<PasswordAlgorithm, Password>'.
          pga[PasswordAlgorithm[pa]] = getPasswordGenerationAlgorithm(PasswordAlgorithm[pa])
          ~~~~~~~~~~~~~~~~~~~~~~~~~~

          TS2345 [ERROR]: Argument of type 'string' is not assignable to parameter of type 'PasswordAlgorithm'.
          pga[PasswordAlgorithm[pa]] = getPasswordGenerationAlgorithm(PasswordAlgorithm[pa])
                                                                      ~~~~~~~~~~~~~~~~~~~~~

      If I try to convert PasswordAlgorithm[pa] to PasswordAlgorithm, which...
      the following would 

          error: TS2352 [ERROR]: Conversion of type 'string' to type 'PasswordAlgorithm' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
              const algoKey = PasswordAlgorithm[pa] as PasswordAlgorithm
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      No idea what is happening here
    */

    const algoKey = (PasswordAlgorithm[pa] as unknown) as PasswordAlgorithm;
    pga[algoKey] = getPasswordGenerationAlgorithm(algoKey);
  }

  return pga;
}

function getPasswordGenerationAlgorithm(pa: PasswordAlgorithm): Password {
  return {
    crypto: {
      algorithm: pa,
      gen(input: string) {
        return input;
      },
      params: [],
    },
    output: "",
  };
}

const pga = getPasswordGenerationAlgorithms();
console.log("pga");
console.log(pga);
console.log("");

const work: Work = {
  company_name: "E",
};
console.log("work");
console.log(work);
console.log("");

const email: Email = ["danillo.paiva.toledo", "@", "gmail.com"];
console.log("email");
console.log(email);
console.log("");

const location1: Location = {
  street: "fighter",
};
console.log("location1");
console.log(location1);
console.log("");

const location2: Location = {
  street: "av",
  number: 420.69,
};
console.log("location2");
console.log(location2);
console.log("");

const user1: User = {
  name: "\u200b",
  birthyear: -1,
  works: [work],
  location: [location1],
  children: [],
};
console.log("user1");
console.log(user1);
console.log("");

const user2: User = {
  name: "\u200b",
  birthyear: -1,
  works: [],
  location: [location2],
  children: [user1],
};
console.log("user2");
console.log(user2);
console.log("");

const suser1: SocialMediaUser = {
  name: "\u200b",
  birthyear: -1,
  email: email,
  password: getPasswordGenerationAlgorithm(PasswordAlgorithm.BCRYPT),
  friends: [],
};
console.log("suser1");
console.log(suser1);
console.log("");

const suser2: SocialMediaUser = {
  name: "\u200b",
  birthyear: -1,
  email: email,
  password: getPasswordGenerationAlgorithm(PasswordAlgorithm.BCRYPT),
  friends: [suser1],
};
console.log("suser2");
console.log(suser2);
console.log("");

const company1: Company = {
  company_name: "E",
  foundation_year: 0,
  location: [location1],
  employees: [user1],
  subsidiary: [],
  parent: [],
};
console.log("company1");
console.log(company1);
console.log("");

const company2: Company = {
  company_name: "E",
  foundation_year: 0,
  location: [location2],
  employees: [user2],
  subsidiary: [company1],
  parent: [],
};
console.log("company2");
console.log(company2);
console.log("");
