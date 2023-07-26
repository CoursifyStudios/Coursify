import Layout from "@/components/layout/layout";
import styles from "../styles/animation.module.scss";

const Animation: NextPageWithLayout = () => {
	// This is just proof of concept, lukas will make it look good later
	return (
		<>
			<div className={styles.container}>
				<div>
					<div className={styles.spinner}>
						<div />
					</div>
					<div className={styles.over} />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={styles.check}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.5 12.75l6 6 9-13.5"
						/>
					</svg>
				</div>
			</div>
		</>
	);
}

export default Animation;

Animation.getLayout = function getLayout(page: ReactElement) {
	return(
		<Layout>
			{page}
		</Layout>

	)
}
