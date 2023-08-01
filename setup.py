import setuptools

setuptools.setup(
    name="streamlit-argoworkflow",
    version="0.0.1",
    author="yaosikai",
    author_email="yaosk@dp.tech",
    description="",
    long_description="",
    long_description_content_type="text/plain",
    url="",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.8",
    install_requires=[
        "streamlit >= 1.23",
        "ordered-set >= 4.1.0"
    ],
)
