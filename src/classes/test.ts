

const aaa: string = 'a';

if(!aaa){
    const aaa = 0 as any ;
    console.log(aaa);
} else {
    console.log('bbb');
}


interface Fooo {
    [key: string]: unknown;
  }
  
  type Foooo = {
    [key: string]: unknown;
  };
  
  type Fooooo = Record<string, unknown>;
  
