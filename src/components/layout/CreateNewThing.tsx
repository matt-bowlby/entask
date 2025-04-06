
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import {Plus } from "lucide-react";

export default function AddNew({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeMenu, setActiveMenu] = useState<"task" | "event" | "tagBlock">("task")

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center text-center items-center p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-[664px] h-[392px] data-closed:translate-y-0 data-closed:scale-95 flex flex-col"
          >
            <div className="bg-off-white rounded-lg flex justify-between p-[10px] h-[83px] flex-shrink-0 m-[10px]">

			  <button type="button"
                onClick={() => setActiveMenu("task")}
				className='bg-dark text-white font-semibold w-[200px] text-xl rounded-md'>Task</button>
			  <button type="button"
                onClick={() => setActiveMenu("event")}
				className='bg-dark text-white font-semibold w-[200px] text-xl rounded-md '>Event</button>
			  <button type="button"
                onClick={() => setActiveMenu("tagBlock")}
				className='bg-dark text-white font-semibold w-[200px] text-xl rounded-md '>Tag Block</button>
            </div>


            <div className="bg-gray-50 h-full max-h-full m-[10px] flex ">

              <div className="h-full w-[82px] flex-shrink-0 mr-2">
				<div className={`text-right flex items-center justify-end mb-[10px] ${activeMenu === "tagBlock" ? "h-[40px]" : "h-[30px]"}`}>Name</div>
				<div className='text-right flex items-center justify-end mb-[10px] h-[30px]'>{activeMenu === 'task' ? 'Duration' : 'Start Date'}</div>
				<div className='text-right flex items-center justify-end mb-[10px] h-[30px]'>{activeMenu === 'task' ? 'Due Date ' : 'End Date'}</div>
				<div className='text-right flex mb-[10px] h-[100px]'>Description</div>
				{activeMenu !== "tagBlock" && <div className='flex items-center justify-end text-right mb-[10px] h-[40px]'>Tags </div>}
			  </div>

              <div className="h-full w-full">
			{activeMenu !== "tagBlock" &&
				<div className='mb-[10px] h-[30px] rounded-xl bg-off-white flex'>
					<input
						id="taskName"
						name="taskName"
						type="text"
						placeholder="Task Name"
						className="min-w-0 grow py-1.5 pl-[10px] text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6"
					/>
					<div className='text-right text-sm/6 flex items-center px-[10px]'>Name</div>
				</div>
				}
			{activeMenu === "tagBlock" &&
				<div className='text-right mb-[10px] h-[40px] flex'>
				<div className='w-full text-right rounded-xl bg-off-white flex mr-[10px] px-[10px] truncate'>


				</div>
				<button className=' justify-center items-center w-full max-w-[40px] text-right rounded-xl bg-off-white flex'>
					<Plus size={17} strokeWidth={5} />
				</button>

			</div>
			}

				{activeMenu === "task" &&
					<div className='text-right mb-[10px] h-[30px] flex '>
					<div className='w-full px-[10px] text-right rounded-xl bg-off-white flex truncate'>
						<input
							id="taskDays"
							name="taskDays"
							type="text"
							placeholder="1"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Days</div>
					</div>

					<div className='w-full text-right rounded-xl px-[10px] mx-[10px] bg-off-white flex truncate'>
						<input
							id="taskHours"
							name="taskHours"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Hours</div>
					</div>

					<div className='w-full text-right rounded-xl px-[10px] bg-off-white flex truncate'>
					<input
							id="taskMinutes"
							name="taskMinutes"
							type="text"
							placeholder="40"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Minutes</div>
					</div>
				</div>
				}



				{activeMenu !== "task" &&
				<div className='text-right mb-[10px] h-[30px] flex'>
					<div className='w-full text-right rounded-xl bg-off-white flex px-[10px] truncate'>
						<input
							id="eventDate"
							name="1"
							type="text"
							placeholder="2030"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Year</div>
					</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate'>
						<input
							id="2"
							name="2"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Month</div>
					</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate mr-[10px]'>
						<input
							id="3"
							name="4"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Day</div>
					</div>

					<div>:</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate'>
						<input
							id="5"
							name="5"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Hour</div>
					</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate'>
					<input
							id="6"
							name="6"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Minute</div>
					</div>

				</div>
				}




				<div className='text-right mb-[10px] h-[30px] flex'>
					<div className='w-full text-right rounded-xl bg-off-white flex px-[10px] truncate'>
						<input
							id="taskYear"
							name="taskYear"
							type="text"
							placeholder="2030"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Year</div>
					</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate'>
						<input
							id="taskMonth"
							name="taskMonth"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Month</div>
					</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate mr-[10px]'>
						<input
							id="taskDueDay"
							name="taskDueDay"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Day</div>
					</div>

					<div>:</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate'>
						<input
							id="taskDueHour"
							name="taskDueHour"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Hour</div>
					</div>

					<div className='w-full text-right ml-[10px] rounded-xl bg-off-white flex px-[10px] truncate'>
					<input
							id="taskDueMinute"
							name="taskDuMinute"
							type="text"
							placeholder="3"
							className="min-w-0 w-full grow py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 flex"
						/>
						<div className='min-w-0 w-full max-w-max text-right text-sm/6 flex items-center'>Minute</div>
					</div>

				</div>
				<div className='text-right mb-[10px] h-[100px] flex'>
					<div className='w-full text-right rounded-xl bg-off-white px-[10px] text-wrap'>
					<textarea
							id="taskDescription"
							name="taskDescription"
							placeholder="Description"
							className="min-w-0 w-full py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm/6 resize-none overflow-y-auto"
						/>
					</div>

				</div>

				{activeMenu !== "tagBlock" &&
				<div className='text-right mb-[10px] h-[40px] flex'>
					<div className='w-full text-right rounded-xl bg-off-white flex mr-[10px] px-[10px] truncate'>


					</div>
					<button className=' justify-center items-center w-full max-w-[40px] text-right rounded-xl bg-off-white flex'>
						<Plus size={17} strokeWidth={5} />
					</button>

				</div>}
				</div>
            </div>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

