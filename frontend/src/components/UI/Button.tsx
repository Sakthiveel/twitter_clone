interface buttonVariants {
  fill: string;
  outline: string;
}
interface ButtonProps {
  clickHandler(): any;
  btnText: string;
  btnVariant: string;
  styles?: object;
  classes?: string;
}
export default function Button(btnProps: ButtonProps) {
  const buttonVariants = {
    base: "p-1 px-4 h-fit delay-100 border rounded-3xl",
    fill: "border-none p-1 px-4 h-fit bg-blue-primary bg-slate-300 text-base hover:bg-blue-hover delay-100 ",
    outline: "border-grey hover:bg-slate-100",
  };
  return (
    <button
      className={`${buttonVariants.base} ${
        buttonVariants?.[btnProps.btnVariant ?? "fill"]
      }`}
      onClick={btnProps.clickHandler}
      style={btnProps.styles}
    >
      {btnProps.btnText}
    </button>
  );
}
