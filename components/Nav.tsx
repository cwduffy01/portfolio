export default function Nav() {
    return (
        <div className="p-6 select-none">
            <div className="flex w-full justify-between items-center">
                <div className="text-6xl font-web-title text-accent">
                    carbs
                </div>
                <div className="flex text-4xl font-web-subtitle gap-8">
                    <div>
                        about
                    </div>
                    <div>
                        portfolio
                    </div>
                    <div>
                        contact
                    </div>
                </div>
            </div>
            <hr className="border-t-2 border-dashed border-neutral-950" />
        </ div>
    );
}