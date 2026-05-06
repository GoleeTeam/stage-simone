import { CatColor } from "../../domain/cats.color.enum";
import { CatColori } from "../../domain/cats.colori.enum";
import { CatColorInput } from "../../application/input/filterCatColorInput";

export function mapCatColori(color: CatColori): CatColorInput {
    switch (color) {
    case CatColori.BIANCO:
      return CatColor.WHITE;

    case CatColori.NERO:
      return CatColor.BLACK;

    case CatColori.GRIGIO:
      return CatColor.GRAY;

    case CatColori.ARANCIONE:
      return CatColor.ORANGE;

    case CatColori.MULTI:
      return CatColor.MULTI;
    }
}
