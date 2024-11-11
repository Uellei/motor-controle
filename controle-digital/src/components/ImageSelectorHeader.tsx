type ImageSelectorHeaderProps = {
    selectedImageKey: "img1" | "img2" | "img3"
    onSelectImage: (key: "img1" | "img2" | "img3") => void
}

export const ImageSelectorHeader = ({selectedImageKey, onSelectImage}: ImageSelectorHeaderProps) => {
    const buttonClasses = (key: "img1" | "img2" | "img3") => {
        return  `border-b-[3px] px-3 mb-[-2px] pb-2 ${selectedImageKey === key ? 'border-[#24475f] text-[#24475f]' : 'border-b-transparent'} hover:border-[#24475f] text-white hover:text-[#24475f]`
    }

    return (
        <div className="flex mt-4 border-b-[2px] border-white text-white text-2xl font-semibold">
            <button
                className={buttonClasses("img1")}
                onClick={() => onSelectImage("img1")}
            >
                Modelo
            </button>
            <button
                className={buttonClasses("img2")}
                onClick={() => onSelectImage("img2")}
            >
                Real
            </button>
            <button
                className={buttonClasses("img3")}
                onClick={() => onSelectImage("img3")}
            >
                Comparação
            </button>
        </div>
    )
}