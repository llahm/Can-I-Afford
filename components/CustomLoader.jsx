export default function CustomLoader({ text = "Loading your sanctuary..." }) {
  
    return (
        <div className="flex flex-col items-center justify-center p-10 space-y-4">
            <div className="uiverse-bg shadow-sm">
                <span className="uiverse-loader" aria-label="Loading animation"></span>
            </div>
            <p className="text-sm font-medium text-cocoa-700 tracking-wide">{text}</p>
        </div>
    );
}