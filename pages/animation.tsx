import styles from "../styles/animation.module.scss";

export default function Animation() {
	return (
		<>
			<div className={styles.container}>
				<div>
					<div className={styles.spinner} />
				</div>
			</div>
		</>
	);
}
