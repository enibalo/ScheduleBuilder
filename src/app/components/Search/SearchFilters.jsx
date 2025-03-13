import "./Search.css";

export default function SearchFilters() {
  return (
    <>
      <div className="w-[450px] m-3 border-2 border-black rounded-md">
        <div className="w-full text-center text-2xl py-2">
          <h2>Filters</h2>
        </div>
        <div className="flex justify-between px-3">
          <div>
            <div className="h-10 flex align-middle p-2">
              <input className="w-5 h-5" type="checkbox" />
              <p className="pl-3">Mourning Classes</p>
            </div>
            <div className="h-10 flex align-middle p-2">
              <input className="w-5 h-5" type="checkbox" />
              <p className="pl-3">Afternoon Classes</p>
            </div>
            <div className="h-10 flex align-middle p-2">
              <input className="w-5 h-5" type="checkbox" />
              <p className="pl-3">Evening Classes</p>
            </div>
            <div className="h-10 flex align-middle p-2">
              <input className="w-5 h-5" type="checkbox" />
              <p className="pl-3">Required Classes</p>
            </div>
          </div>
          <div>
            <div className="h-10 flex align-middle p-2">
              <input className="w-5 h-5" type="checkbox" />
              <p className="pl-3">Waitlistable Classes</p>
            </div>
            <div className="h-10 flex align-middle p-2">
              <input className="w-5 h-5" type="checkbox" />
              <p className="pl-3">Full Classes</p>
            </div>
            <div className="h-10 flex align-middle p-2">
              <input className="w-5 h-5" type="checkbox" />
              <p className="pl-3">Eligible Classes</p>
            </div>
          </div>
        </div>

        <div className="w-full flex items-end px-5">
          <div className="ml-auto">
            <button type="button" className="button-primary">Default</button>
            <button type="button" className="button-primary">Save</button>
          </div>
        </div>
      </div>
    </>
  );
}
