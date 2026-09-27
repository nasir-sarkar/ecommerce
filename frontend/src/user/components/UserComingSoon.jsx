export default function UserComingSoon({ page = 'This page' }) {
  return (
    <div className="text-center py-[3rem]">
      <div className="text-[48px] mb-[16px]">🚧</div>
      <h2 className="font-bold mb-[0.5rem] text-[20px]">{page}</h2>
      <p className="text-[#919199] text-[14px]">Coming soon — will be connected to the API.</p>
    </div>
  )
}