// how not to split a sentence ?!

/*
        // push
        text += matches[i];
        const column = size + 1;
        size += text.length;
        output.push({
          text: text,
          location: {
            column,
          },
        });
        text = "";




/*


  console.log(matches)
  if (matches.length % 3 == 1) {
    // remove last empty
    if (!matches[matches.length -1]) {
matches.pop()
    } else {
        // add two more to process the ending
    matches.push("")
    matches.push("")
    }
  }

  let text = "";
  for (let i = 0; i < matches.length; ++i) {
    switch (i % 3) {
      case 0:
        text = matches[i];
        break;
      case 1:
        // ignore
        break;
      case 2: {
        // push
        text += matches[i];
        const column = size + 1;
        size += text.length;
        output.push({
          text: text,
          location: {
            column,
          },
        });
        text = "";
    }break;
    }
  }
  return output;
  /*
    .map((text) => {
        console.log(text)
        let column = size + 1;
        size += text.length;
        return {
            text,
            location: {
                column
            }
        }
    });

  const output: Sentence[] = [];
  let start = 0;
  let found;
  let re = /(\.|…|\?|!)/;
  do {
    found = false;
    //const c = output.length == 0 ? paragraph.search(/(\.|…|\?|!)/) : paragraph.search(/(\.|…|¿|¡)/);
    //const c = paragraph.search(/(\.|…|\?|!)/);
    let c = paragraph.search(re);

    console.log(
        re,
      "char = ",
      paragraph[c],
      "c",
      c,
      "length",
      paragraph.length,
      paragraph.substring(0, c + 1),
    );

    if (c >= 0 && c != paragraph.length - 1) {
      // three dots ?
      if (
        paragraph[c] == "." && paragraph[c + 1] == "." &&
        paragraph[c + 2] == "."
      ) {
        output.push({
          text: paragraph.substring(0, c + 3),
          location: {
            column: start + 1,
          },
        });
        paragraph = paragraph.substring(c + 3);
        start += c + 3;
      } else {
        output.push({
          text: paragraph.substring(0, c + 1),
          location: {
            column: start + 1,
          },
        });
        paragraph = paragraph.substring(c + 1);
        start += c + 1;
      }
      found = true;
    }
  } while (found);

  if (start != paragraph.length) {
    output.push({
      text: paragraph,
      location: {
        column: start + 1,
      },
    });
  }

  // now split exclamations and questions marks
  // this way we can split incomplete staff

  let open;
  let close;

  console.log(output);
let MAX = 10;
  for (let i = 0; i < output.length; ++i) {
    console.log(i, output[i].text)
    while ((open = output[i].text.indexOf("¡")) > 2) {
        close = output[i].text.indexOf("!", open);
        const t = output[i].text;
        output[i].text = output[i].text.substring(0, open);

        output.splice(i + 1, 0, {
            text: t.substring(open, close),
            location: {
                column: output[i].location.column + open
            }
        });

        if (--MAX == 0) {
            return output;
        }
    }
  }
console.log(output)

  return output;
}




export function split3(paragraph: string): Sentence[] {
  console.log("split", paragraph);

  if (paragraph.indexOf("\n") > 0) {
    throw Error("paragraph containes new lines ence is a text");
  }
  /*
    const output = paragraph.split(/\.(?!$)/).map((text) => {
        return {
            text
        }
    });
  
  const output: Sentence[] = [];
  let start = 0;
  let found;
  let re = /(\.|…|¿|¡)/;
  do {
    found = false;
    //const c = output.length == 0 ? paragraph.search(/(\.|…|\?|!)/) : paragraph.search(/(\.|…|¿|¡)/);
    //const c = paragraph.search(/(\.|…|\?|!)/);
    let c = paragraph.search(re);

    console.log(
      re,
      "char = ",
      paragraph[c],
      "c",
      c,
      "length",
      paragraph.length,
      paragraph.substring(0, c + 1),
    );

    if (c >= 0 && c != paragraph.length - 1) {
      if (paragraph[c] == "¿") {
        re = /(\?)/;
        found = true;
        continue;
      } else if (paragraph[c] == "¡") {
        re = /(!)/;
        found = true;
        continue;
      } else {
        re = /(\.|…|¿|¡)/;
      }

      // c +=  ||paragraph[c] == "¡" ? 1 : 0;

      // three dots ?
      if (
        paragraph[c] == "." && paragraph[c + 1] == "." &&
        paragraph[c + 2] == "."
      ) {
        output.push({
          text: paragraph.substring(0, c + 3),
          location: {
            column: start + 1,
          },
        });
        paragraph = paragraph.substring(c + 3);
        start += c + 3;
      } else {
        output.push({
          text: paragraph.substring(0, c + 1),
          location: {
            column: start + 1,
          },
        });
        paragraph = paragraph.substring(c + 1);
        start += c + 1;
      }
      found = true;
    }
  } while (found);

  if (start != paragraph.length) {
    output.push({
      text: paragraph,
      location: {
        column: start + 1,
      },
    });
  }

  return output;
  




export function split2(paragraph: string): Sentence[] {
  console.log("split", paragraph);

  if (paragraph.indexOf("\n") > 0) {
    throw Error("paragraph containes new lines ence is a text");
  }
  /*
    const output = paragraph.split(/\.(?!$)/).map((text) => {
        return {
            text
        }
    });
  */
  const output: Sentence[] = [];
  let start = 0;
  let found;
  do {
    found = false;
    const dot = paragraph.indexOf(".", start);
    const threedot = paragraph.indexOf("…", start);

    console.log("dot", start, dot);
    console.log("threedot", start, threedot);

    const c = dot === -1
      ? threedot
      : (threedot === -1 ? dot : (threedot < dot ? threedot : dot));

    console.log("c", c);

    if (c >= 0) {
      // three dots ?
      if (paragraph[c + 1] == "." && paragraph[c + 2] == ".") {
        output.push({
          text: paragraph.substring(start, c + 3),
          location: {
            column: start + 1,
          },
        });
        start = c + 3;
      } else {
        output.push({
          text: paragraph.substring(start, c + 1),
          location: {
            column: start + 1,
          },
        });
        start = c + 1;
      }
      found = true;
    }
  } while (found);

  if (start != paragraph.length) {
    output.push({
      text: paragraph.substring(start),
      location: {
        column: start + 1,
      },
    });
  }

  return output;
}