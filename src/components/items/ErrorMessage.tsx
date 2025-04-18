interface ErrorMessageProps {
	message: string;
	className?: string;
    type?: 'error' | 'warning' | 'info';
}

const ErrorMessage = ({ className, message, type = 'error' }: ErrorMessageProps) => {
	const getClassName = () => {
		switch (type) {
			case 'error':
				return 'text-red-500';
			case 'warning':
				return 'text-yellow-500';
			case 'info':
				return 'text-blue-500';
			default:
				return 'text-red-500';
		}
	};

	return <div className={`${className} ${getClassName()}`}>{message}</div>;
};

export default ErrorMessage